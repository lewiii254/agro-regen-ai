import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Activity, Satellite, Map as MapIcon, Layers, TrendingUp, Calendar } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import L from "leaflet";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Farm {
  id: string;
  name: string;
  location: string;
  soil_type: string | null;
  latitude: number | null;
  longitude: number | null;
  size_hectares: number | null;
  health_score?: number | null;
  latest_report_date?: string | null;
  health_history?: { date: string; score: number }[];
}

const getHealthColor = (score: number | null | undefined): string => {
  if (!score) return "#6B7280"; // gray for no data
  if (score >= 80) return "#10B981"; // green for excellent
  if (score >= 60) return "#F59E0B"; // yellow for good
  if (score >= 40) return "#F97316"; // orange for fair
  return "#EF4444"; // red for poor
};

const getHealthLabel = (score: number | null | undefined): string => {
  if (!score) return "No Data";
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
};

const createCustomMarker = (healthScore: number | null | undefined) => {
  const color = getHealthColor(healthScore);
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: "custom-marker",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const FarmMap = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-0.0236, 37.9062]);
  const [selectedLayer, setSelectedLayer] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  useEffect(() => {
    fetchFarms();
    
    // Setup realtime subscription
    const channel = supabase
      .channel('farms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'farms'
        },
        () => {
          fetchFarms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFarms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: farmsData, error: farmsError } = await supabase
        .from("farms")
        .select("*")
        .eq("user_id", user.id);

      if (farmsError) throw farmsError;

      const farmsWithCoords = (farmsData || []).filter(
        (farm) => farm.latitude !== null && farm.longitude !== null
      );

      // Fetch latest soil health reports and history for each farm
      const farmsWithHealth = await Promise.all(
        farmsWithCoords.map(async (farm) => {
          const { data: reports } = await supabase
            .from("soil_health_reports")
            .select("health_score, created_at")
            .eq("farm_id", farm.id)
            .order("created_at", { ascending: false })
            .limit(6);

          const health_history = reports?.map(r => ({
            date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: r.health_score || 0
          })).reverse() || [];

          return {
            ...farm,
            health_score: reports?.[0]?.health_score || null,
            latest_report_date: reports?.[0]?.created_at || null,
            health_history,
          };
        })
      );

      setFarms(farmsWithHealth);

      if (farmsWithHealth.length > 0) {
        // Calculate center of all farms
        const avgLat =
          farmsWithHealth.reduce((sum, farm) => sum + (farm.latitude || 0), 0) /
          farmsWithHealth.length;
        const avgLng =
          farmsWithHealth.reduce((sum, farm) => sum + (farm.longitude || 0), 0) /
          farmsWithHealth.length;
        setMapCenter([avgLat, avgLng]);
      } else {
        // Default to Kenya's approximate center
        setMapCenter([-0.0236, 37.9062]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch farms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTileLayerUrl = () => {
    switch (selectedLayer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (selectedLayer) {
      case 'satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'terrain':
        return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Farm Map</h1>
            <p className="text-muted-foreground mt-2">
              Visualize your farms with interactive maps, satellite imagery, and health indicators
            </p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-pulse">Loading map...</div>
            </CardContent>
          </Card>
        ) : farms.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground">No farms with coordinates</p>
              <p className="text-muted-foreground mt-2">
                Add latitude and longitude to your farms to see them on the map
              </p>
              <div className="flex gap-4 mt-6">
                <Button onClick={() => navigate("/manage-farms")}>
                  Manage Farms
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3 animate-fade-in-up">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Interactive Farm Map
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedLayer === 'standard' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedLayer('standard')}
                        className="gap-1"
                      >
                        <MapIcon className="h-4 w-4" />
                        Standard
                      </Button>
                      <Button
                        variant={selectedLayer === 'satellite' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedLayer('satellite')}
                        className="gap-1"
                      >
                        <Satellite className="h-4 w-4" />
                        Satellite
                      </Button>
                      <Button
                        variant={selectedLayer === 'terrain' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedLayer('terrain')}
                        className="gap-1"
                      >
                        <MapPin className="h-4 w-4" />
                        Terrain
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {selectedLayer === 'satellite' && 'Satellite imagery view with real-time farm locations'}
                    {selectedLayer === 'terrain' && 'Topographic terrain view with elevation data'}
                    {selectedLayer === 'standard' && 'Standard map view with street details'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div style={{ height: "600px", width: "100%" }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={8}
                      scrollWheelZoom={true}
                      style={{ height: "100%", width: "100%" }}
                      key={selectedLayer}
                    >
                      <TileLayer
                        url={getTileLayerUrl()}
                        attribution={getTileLayerAttribution()}
                      />
                      {farms.map((farm) => (
                        <Marker
                          key={farm.id}
                          position={[farm.latitude!, farm.longitude!] as LatLngExpression}
                          icon={createCustomMarker(farm.health_score)}
                        >
                          <Popup>
                            <div className="p-2 min-w-[200px]">
                              <h3 className="font-semibold text-base">{farm.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {farm.location}
                              </p>
                              {farm.health_score !== null && farm.health_score !== undefined && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Activity className="h-4 w-4" style={{ color: getHealthColor(farm.health_score) }} />
                                  <span className="text-sm font-medium">
                                    Health: {farm.health_score}/100 ({getHealthLabel(farm.health_score)})
                                  </span>
                                </div>
                              )}
                              {farm.size_hectares && (
                                <p className="text-sm mt-1">
                                  Size: {farm.size_hectares} hectares
                                </p>
                              )}
                              {farm.soil_type && (
                                <p className="text-sm">Soil: {farm.soil_type}</p>
                              )}
                              {farm.latest_report_date && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Last updated: {new Date(farm.latest_report_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Map Layers
                  </CardTitle>
                  <CardDescription>
                    Switch between different map views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Standard Map</p>
                        <p className="text-xs text-muted-foreground">Traditional street and boundary view</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Satellite className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Satellite Imagery</p>
                        <p className="text-xs text-muted-foreground">High-resolution satellite view for farm analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Terrain Map</p>
                        <p className="text-xs text-muted-foreground">Topographic view with elevation data</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Farm Health Legend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { label: "Excellent (80-100)", color: "#10B981" },
                      { label: "Good (60-79)", color: "#F59E0B" },
                      { label: "Fair (40-59)", color: "#F97316" },
                      { label: "Poor (0-39)", color: "#EF4444" },
                      { label: "No Data", color: "#6B7280" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Your Farms</CardTitle>
                  <CardDescription>
                    {farms.length} {farms.length === 1 ? "farm" : "farms"} with GPS coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {farms.map((farm) => (
                      <div
                        key={farm.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent hover:scale-105 transition-all duration-200 cursor-pointer animate-scale-in"
                        onClick={() => {
                          setMapCenter([farm.latitude!, farm.longitude!] as LatLngExpression);
                          setSelectedFarm(farm);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                            style={{ backgroundColor: getHealthColor(farm.health_score) }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">{farm.name}</p>
                              {farm.health_score !== null && farm.health_score !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {farm.health_score}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {farm.location}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {farm.size_hectares && (
                                <p className="text-xs text-muted-foreground">
                                  {farm.size_hectares} ha
                                </p>
                              )}
                              {farm.health_score !== null && farm.health_score !== undefined && (
                                <p className="text-xs font-medium" style={{ color: getHealthColor(farm.health_score) }}>
                                  {getHealthLabel(farm.health_score)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Trends Card */}
            {selectedFarm && selectedFarm.health_history && selectedFarm.health_history.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Health Trend - {selectedFarm.name}
                  </CardTitle>
                  <CardDescription>
                    Historical soil health scores over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selectedFarm.health_history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        domain={[0, 100]}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Health Score"
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Last {selectedFarm.health_history.length} reports</span>
                    </div>
                    {selectedFarm.health_score && (
                      <Badge 
                        variant="outline" 
                        style={{ color: getHealthColor(selectedFarm.health_score) }}
                      >
                        Current: {selectedFarm.health_score}/100
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmMap;
