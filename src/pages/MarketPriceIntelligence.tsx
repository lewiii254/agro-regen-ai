import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const MarketPriceIntelligence = () => {
  const navigate = useNavigate();
  const [marketPrices, setMarketPrices] = useState<Record<string, Array<{
    crop_type: string;
    region: string;
    price_per_kg: number;
    currency: string;
    market_trend: string;
    recorded_date: string;
  }>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchMarketPrices();
        seedMarketData();
      }
    };
    initAuth();
  }, [navigate]);

  const seedMarketData = async () => {
    // Seed some sample market data
    const sampleData = [
      { crop_type: "Maize", region: "Nairobi", price_per_kg: 45.50, currency: "KES", market_trend: "rising", recorded_date: "2025-10-10" },
      { crop_type: "Wheat", region: "Nairobi", price_per_kg: 62.00, currency: "KES", market_trend: "stable", recorded_date: "2025-10-10" },
      { crop_type: "Rice", region: "Nairobi", price_per_kg: 85.00, currency: "KES", market_trend: "falling", recorded_date: "2025-10-10" },
      { crop_type: "Beans", region: "Nairobi", price_per_kg: 120.00, currency: "KES", market_trend: "rising", recorded_date: "2025-10-10" },
      { crop_type: "Potatoes", region: "Nairobi", price_per_kg: 35.00, currency: "KES", market_trend: "stable", recorded_date: "2025-10-10" },
      { crop_type: "Tomatoes", region: "Nairobi", price_per_kg: 55.00, currency: "KES", market_trend: "rising", recorded_date: "2025-10-10" },
    ];

    try {
      for (const data of sampleData) {
        await (supabase as any).from("market_prices").upsert(data);
      }
    } catch (error) {
      console.error("Error seeding market data:", error);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("market_prices")
        .select("*")
        .order("recorded_date", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Group by crop type
      const groupedData = data?.reduce((acc: Record<string, Array<{
        crop_type: string;
        region: string;
        price_per_kg: number;
        currency: string;
        market_trend: string;
        recorded_date: string;
      }>>, curr: any) => {
        if (!acc[curr.crop_type]) {
          acc[curr.crop_type] = [];
        }
        acc[curr.crop_type].push(curr);
        return acc;
      }, {});

      setMarketPrices(groupedData || {});
    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "falling":
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case "stable":
        return <Minus className="h-5 w-5 text-blue-600" />;
      default:
        return <Minus className="h-5 w-5" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "bg-green-100 text-green-800 border-green-300";
      case "falling":
        return "bg-red-100 text-red-800 border-red-300";
      case "stable":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRecommendation = (trend: string, cropType: string) => {
    if (trend === "rising") {
      return `✅ Good time to sell ${cropType}. Prices are trending upward.`;
    } else if (trend === "falling") {
      return `⏳ Consider holding ${cropType}. Prices are declining.`;
    } else {
      return `📊 Market is stable for ${cropType}. Monitor for changes.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              📈 Market Price Intelligence
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Real-time crop prices and market trends
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(marketPrices).map(([cropType, prices]) => {
              const latestPrice = prices[0];
              return (
                <Card key={cropType} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-emerald-600" />
                          {cropType}
                        </CardTitle>
                        <CardDescription>{latestPrice.region}</CardDescription>
                      </div>
                      <Badge className={getTrendColor(latestPrice.market_trend)}>
                        <span className="flex items-center gap-1">
                          {getTrendIcon(latestPrice.market_trend)}
                          {latestPrice.market_trend}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-emerald-600 mb-1">
                        {latestPrice.currency} {latestPrice.price_per_kg}
                        <span className="text-lg text-muted-foreground">/kg</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        As of {new Date(latestPrice.recorded_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200">
                      <p className="text-sm font-medium mb-1">💡 Recommendation:</p>
                      <p className="text-sm text-muted-foreground">
                        {getRecommendation(latestPrice.market_trend, cropType)}
                      </p>
                    </div>

                    {prices.length > 1 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold mb-2 text-muted-foreground">Price History</p>
                        <ResponsiveContainer width="100%" height={100}>
                          <LineChart data={prices.slice(0, 7).reverse()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="recorded_date" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="price_per_kg" 
                              stroke="#10b981" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && Object.keys(marketPrices).length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No market data available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MarketPriceIntelligence;
