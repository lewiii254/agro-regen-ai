import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertTriangle, CheckCircle2, Cloud, CloudRain, Droplets, Wind, Thermometer, Sun, CloudDrizzle } from "lucide-react";
import { toast } from "sonner";

interface ClimateAlert {
  id: string;
  alert_type: string;
  severity: string;
  description: string;
  forecast_date: string;
  is_read: boolean;
  farm_id: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
}

interface DroughtRisk {
  level: "Low" | "Medium" | "High" | "Extreme";
  percentage: number;
  description: string;
}

const ClimateAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 24,
    humidity: 65,
    precipitation: 15,
    windSpeed: 12,
    condition: "Partly Cloudy"
  });
  const [droughtRisk, setDroughtRisk] = useState<DroughtRisk>({
    level: "Medium",
    percentage: 45,
    description: "Moderate drought conditions expected in the next 30 days"
  });

  useEffect(() => {
    fetchAlerts();
    setupRealtimeAlerts();
  }, []);

  const setupRealtimeAlerts = () => {
    const channel = supabase
      .channel('climate-alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'climate_alerts'
        },
        (payload) => {
          const newAlert = payload.new as ClimateAlert;
          setAlerts(prev => [newAlert, ...prev]);
          toast.info(`New ${newAlert.severity} Alert`, {
            description: newAlert.alert_type
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: farmsData, error: farmsError } = await supabase
        .from("farms")
        .select("id")
        .eq("user_id", user.id);

      if (farmsError) throw farmsError;

      if (!farmsData || farmsData.length === 0) {
        setAlerts([]);
        setLoading(false);
        return;
      }

      const farmIds = farmsData.map(f => f.id);

      const { data, error } = await supabase
        .from("climate_alerts")
        .select("*")
        .in("farm_id", farmIds)
        .order("forecast_date", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch climate alerts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("climate_alerts")
        .update({ is_read: true })
        .eq("id", alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
      toast.success("Alert marked as read");
    } catch (error: any) {
      toast.error("Failed to update alert");
      console.error(error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "medium":
        return <Cloud className="h-5 w-5 text-orange-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "rainy":
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case "sunny":
        return <Sun className="h-12 w-12 text-yellow-500" />;
      default:
        return <CloudDrizzle className="h-12 w-12 text-blue-400" />;
    }
  };

  const getDroughtColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "extreme":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-green-500";
    }
  };

  const highSeverityAlerts = alerts.filter(a => a.severity.toLowerCase() === "high");
  const mediumSeverityAlerts = alerts.filter(a => a.severity.toLowerCase() === "medium");
  const lowSeverityAlerts = alerts.filter(a => a.severity.toLowerCase() === "low");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-sky/5 to-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/dashboard")}
            className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky via-primary to-accent bg-clip-text text-transparent">
              ⛈️ Climate Prediction Engine
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Hyperlocal weather forecasts and climate risk predictions
            </p>
          </div>
        </div>

        {/* Real-time Weather Dashboard */}
        <div className="grid gap-6 md:grid-cols-4 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Card className="hover:shadow-strong transition-all duration-300 bg-gradient-to-br from-orange/5 to-card border-2 border-orange/20 hover:scale-105 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-orange/20 group-hover:bg-orange/30 transition-colors">
                  <Thermometer className="h-8 w-8 text-orange-500 group-hover:animate-pulse" />
                </div>
                <Badge variant="secondary" className="bg-orange/20 text-orange-700">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent">{weatherData.temperature}°C</div>
              <p className="text-sm text-muted-foreground mt-1 font-semibold">Temperature</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-strong transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-card border-2 border-blue-500/20 hover:scale-105 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Droplets className="h-8 w-8 text-blue-500 group-hover:animate-bounce-subtle" />
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-700">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent">{weatherData.humidity}%</div>
              <p className="text-sm text-muted-foreground mt-1 font-semibold">Humidity</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-strong transition-all duration-300 bg-gradient-to-br from-indigo-500/5 to-card border-2 border-indigo-500/20 hover:scale-105 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                  <CloudRain className="h-8 w-8 text-indigo-500 group-hover:animate-float" />
                </div>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-700">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-br from-indigo-500 to-indigo-600 bg-clip-text text-transparent">{weatherData.precipitation}mm</div>
              <p className="text-sm text-muted-foreground mt-1 font-semibold">Precipitation</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-strong transition-all duration-300 bg-gradient-to-br from-teal-500/5 to-card border-2 border-teal-500/20 hover:scale-105 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-teal-500/20 group-hover:bg-teal-500/30 transition-colors">
                  <Wind className="h-8 w-8 text-teal-500 group-hover:animate-wave" />
                </div>
                <Badge variant="secondary" className="bg-teal-500/20 text-teal-700">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-br from-teal-500 to-teal-600 bg-clip-text text-transparent">{weatherData.windSpeed} km/h</div>
              <p className="text-sm text-muted-foreground mt-1 font-semibold">Wind Speed</p>
            </CardContent>
          </Card>
        </div>

        {/* Drought Risk Indicator */}
        <Card className="mb-8 animate-fade-in-up border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-card hover:shadow-strong transition-all duration-300" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Droplets className="h-7 w-7 text-blue-600 animate-pulse" />
                </div>
                <CardTitle className="text-2xl">Drought Risk Assessment</CardTitle>
              </div>
              <Badge 
                variant={droughtRisk.level === "High" || droughtRisk.level === "Extreme" ? "destructive" : droughtRisk.level === "Medium" ? "secondary" : "outline"}
                className="text-base px-4 py-1"
              >
                {droughtRisk.level} Risk
              </Badge>
            </div>
            <CardDescription>{droughtRisk.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Level</span>
                <span className="font-semibold">{droughtRisk.percentage}%</span>
              </div>
              <Progress value={droughtRisk.percentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>Low</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Extreme</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Statistics */}
        <div className="grid gap-4 md:grid-cols-3 mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">High Severity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{highSeverityAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Medium Severity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{mediumSeverityAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Monitor conditions</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Low Severity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{lowSeverityAlerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Routine monitoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Tabs */}
        <Tabs defaultValue="all" className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="high">High Priority</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6 mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Cloud className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold text-foreground">No climate alerts</p>
                  <p className="text-muted-foreground mt-2">
                    Add a farm to start receiving climate predictions
                  </p>
                  <Button className="mt-6" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.map((alert, index) => (
                  <Card 
                    key={alert.id} 
                    className={`transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${alert.is_read ? "opacity-60" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <CardTitle className="text-lg">{alert.alert_type}</CardTitle>
                        </div>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {new Date(alert.forecast_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-4">{alert.description}</p>
                      {!alert.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="w-full"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="high" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {highSeverityAlerts.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-semibold">No high severity alerts</p>
                    <p className="text-sm text-muted-foreground mt-2">All clear for now!</p>
                  </CardContent>
                </Card>
              ) : (
                highSeverityAlerts.map((alert, index) => (
                  <Card 
                    key={alert.id} 
                    className={`border-red-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${alert.is_read ? "opacity-60" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <CardTitle className="text-lg">{alert.alert_type}</CardTitle>
                        </div>
                        <Badge variant="destructive">{alert.severity}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {new Date(alert.forecast_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-4">{alert.description}</p>
                      {!alert.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="w-full"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="medium" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mediumSeverityAlerts.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Cloud className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-semibold">No medium severity alerts</p>
                  </CardContent>
                </Card>
              ) : (
                mediumSeverityAlerts.map((alert, index) => (
                  <Card 
                    key={alert.id} 
                    className={`border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${alert.is_read ? "opacity-60" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <CardTitle className="text-lg">{alert.alert_type}</CardTitle>
                        </div>
                        <Badge variant="secondary">{alert.severity}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {new Date(alert.forecast_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-4">{alert.description}</p>
                      {!alert.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="w-full"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="low" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lowSeverityAlerts.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-semibold">No low severity alerts</p>
                  </CardContent>
                </Card>
              ) : (
                lowSeverityAlerts.map((alert, index) => (
                  <Card 
                    key={alert.id} 
                    className={`border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${alert.is_read ? "opacity-60" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(alert.severity)}
                          <CardTitle className="text-lg">{alert.alert_type}</CardTitle>
                        </div>
                        <Badge variant="outline">{alert.severity}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {new Date(alert.forecast_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-4">{alert.description}</p>
                      {!alert.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="w-full"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClimateAlerts;
