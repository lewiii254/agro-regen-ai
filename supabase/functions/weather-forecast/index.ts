import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Cloudy",
  45: "Foggy", 48: "Foggy",
  51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
  61: "Rainy", 63: "Rainy", 65: "Heavy Rain",
  71: "Snowy", 73: "Snowy", 75: "Heavy Snow",
  80: "Rain Showers", 81: "Rain Showers", 82: "Heavy Showers",
  95: "Thunderstorm", 96: "Thunderstorm", 99: "Severe Thunderstorm",
};

function computeDroughtRisk(precipSum: number, avgHumidity: number) {
  // mm/30days threshold heuristic
  let percentage = Math.max(0, Math.min(100, 100 - (precipSum / 80) * 100));
  // humidity factor
  percentage = Math.round(percentage * 0.7 + (100 - avgHumidity) * 0.3);
  let level: "Low" | "Medium" | "High" | "Extreme" = "Low";
  if (percentage >= 80) level = "Extreme";
  else if (percentage >= 60) level = "High";
  else if (percentage >= 35) level = "Medium";
  const description =
    level === "Extreme"
      ? "Severe drought risk — irrigate immediately and prioritize drought-resistant crops."
      : level === "High"
      ? "High drought risk expected in the next 30 days. Conserve water and monitor closely."
      : level === "Medium"
      ? "Moderate drought conditions possible. Plan irrigation carefully."
      : "Adequate rainfall expected. Conditions are favorable.";
  return { level, percentage, description };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get('lat') ?? '');
    const lon = parseFloat(url.searchParams.get('lon') ?? '');

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return new Response(JSON.stringify({ error: 'lat and lon required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
      `&hourly=relative_humidity_2m` +
      `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
      `&forecast_days=14&past_days=16&timezone=auto`;

    const resp = await fetch(apiUrl);
    if (!resp.ok) throw new Error(`Open-Meteo error: ${resp.status}`);
    const data = await resp.json();

    const current = data.current ?? {};
    const condition = WEATHER_CODE_MAP[current.weather_code] ?? 'Unknown';

    const precipSum: number = (data.daily?.precipitation_sum ?? [])
      .reduce((a: number, b: number) => a + (b ?? 0), 0);
    const humidities: number[] = data.hourly?.relative_humidity_2m ?? [];
    const avgHumidity = humidities.length
      ? humidities.reduce((a, b) => a + b, 0) / humidities.length
      : current.relative_humidity_2m ?? 50;

    const drought = computeDroughtRisk(precipSum, avgHumidity);

    return new Response(JSON.stringify({
      weather: {
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        precipitation: Math.round((current.precipitation ?? 0) * 10) / 10,
        windSpeed: Math.round(current.wind_speed_10m),
        condition,
      },
      drought,
      meta: { precipSum30d: Math.round(precipSum), avgHumidity: Math.round(avgHumidity) },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
