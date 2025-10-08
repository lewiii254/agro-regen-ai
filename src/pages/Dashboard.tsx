import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Sprout, 
  LogOut, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  MessageSquare,
  Users,
  MapPin
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        navigate("/auth");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  // Mock data for charts
  const soilHealthData = [
    { month: "Jan", ph: 6.5, nitrogen: 45, phosphorus: 38, potassium: 42 },
    { month: "Feb", ph: 6.7, nitrogen: 48, phosphorus: 40, potassium: 44 },
    { month: "Mar", ph: 6.6, nitrogen: 52, phosphorus: 42, potassium: 46 },
    { month: "Apr", ph: 6.8, nitrogen: 55, phosphorus: 45, potassium: 48 },
    { month: "May", ph: 7.0, nitrogen: 58, phosphorus: 47, potassium: 50 },
  ];

  const moistureData = [
    { day: "Mon", moisture: 65 },
    { day: "Tue", moisture: 62 },
    { day: "Wed", moisture: 68 },
    { day: "Thu", moisture: 70 },
    { day: "Fri", moisture: 67 },
    { day: "Sat", moisture: 64 },
    { day: "Sun", moisture: 66 },
  ];

  const farmHealthDistribution = [
    { name: "Excellent", value: 35, color: "hsl(var(--accent))" },
    { name: "Good", value: 45, color: "hsl(var(--primary))" },
    { name: "Fair", value: 15, color: "hsl(var(--muted))" },
    { name: "Needs Attention", value: 5, color: "hsl(var(--destructive))" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sprout className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AgroReGen</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.full_name || "Farmer"}!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your farm's health and climate conditions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Button
            className="h-auto py-6 flex-col gap-2"
            variant="outline"
            onClick={() => navigate("/soil-analyzer")}
          >
            <Sprout className="h-6 w-6" />
            <span>Soil Analyzer</span>
          </Button>
          <Button
            className="h-auto py-6 flex-col gap-2"
            variant="outline"
            onClick={() => navigate("/climate-alerts")}
          >
            <AlertTriangle className="h-6 w-6" />
            <span>Climate Alerts</span>
          </Button>
          <Button
            className="h-auto py-6 flex-col gap-2"
            variant="outline"
            onClick={() => navigate("/chatbot")}
          >
            <MessageSquare className="h-6 w-6" />
            <span>AI Advisor</span>
          </Button>
          <Button
            className="h-auto py-6 flex-col gap-2"
            variant="outline"
            onClick={() => navigate("/community-hub")}
          >
            <Users className="h-6 w-6" />
            <span>Community</span>
          </Button>
          <Button
            className="h-auto py-6 flex-col gap-2"
            variant="outline"
            onClick={() => navigate("/farm-map")}
          >
            <MapPin className="h-6 w-6" />
            <span>Farm Map</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Soil Health Score</h3>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">87/100</div>
            <p className="text-sm text-accent">+5% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Moisture Level</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">66%</div>
            <p className="text-sm text-primary">Optimal range</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Active Alerts</h3>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">2</div>
            <p className="text-sm text-muted-foreground">1 high, 1 medium</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-muted-foreground">Farms Managed</h3>
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">3</div>
            <p className="text-sm text-accent">All monitored</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Soil Nutrients Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={soilHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Line type="monotone" dataKey="nitrogen" stroke="hsl(var(--primary))" strokeWidth={2} name="Nitrogen" />
                <Line type="monotone" dataKey="phosphorus" stroke="hsl(var(--accent))" strokeWidth={2} name="Phosphorus" />
                <Line type="monotone" dataKey="potassium" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Potassium" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Weekly Soil Moisture</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moistureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar dataKey="moisture" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Farm Health Distribution */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-6">Farm Health Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={farmHealthDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {farmHealthDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {farmHealthDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="h-4 w-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;