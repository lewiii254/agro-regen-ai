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
  MapPin,
  Settings
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { NotificationBell } from "@/components/NotificationBell";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light/10 to-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card/80 backdrop-blur-md border-b border-border shadow-medium sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <Sprout className="h-10 w-10 text-primary animate-pulse-glow" style={{ color: 'hsl(var(--primary))' }} />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AgroReGen</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <NotificationBell />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2 hover:bg-destructive hover:text-white transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Welcome back, {user?.user_metadata?.full_name || "Farmer"}!
          </h2>
          <p className="text-lg text-muted-foreground">
            Here's an overview of your farm's health and climate conditions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 animate-fade-in bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary hover:to-accent hover:text-white border-2 border-primary/20 hover:border-transparent shadow-medium hover:shadow-accent group"
            variant="outline"
            onClick={() => navigate("/soil-analyzer")}
          >
            <Sprout className="h-7 w-7 group-hover:animate-bounce-subtle" />
            <span className="font-semibold">Soil Analyzer</span>
          </Button>
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-destructive/10 to-orange/10 hover:from-destructive hover:to-orange hover:text-white border-2 border-destructive/20 hover:border-transparent shadow-medium group"
            variant="outline"
            onClick={() => navigate("/climate-alerts")}
            style={{ animationDelay: '0.1s' }}
          >
            <AlertTriangle className="h-7 w-7 group-hover:animate-wave" />
            <span className="font-semibold">Climate Alerts</span>
          </Button>
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-accent/10 to-primary/10 hover:from-accent hover:to-primary hover:text-white border-2 border-accent/20 hover:border-transparent shadow-medium group"
            variant="outline"
            onClick={() => navigate("/chatbot")}
            style={{ animationDelay: '0.2s' }}
          >
            <MessageSquare className="h-7 w-7 group-hover:animate-pulse" />
            <span className="font-semibold">AI Advisor</span>
          </Button>
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-purple/10 to-primary/10 hover:from-purple hover:to-primary hover:text-white border-2 border-purple/20 hover:border-transparent shadow-medium group"
            variant="outline"
            onClick={() => navigate("/community-hub")}
            style={{ animationDelay: '0.3s' }}
          >
            <Users className="h-7 w-7 group-hover:animate-float" />
            <span className="font-semibold">Community</span>
          </Button>
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-sky/10 to-accent/10 hover:from-sky hover:to-accent hover:text-white border-2 border-sky/20 hover:border-transparent shadow-medium group"
            variant="outline"
            onClick={() => navigate("/farm-map")}
            style={{ animationDelay: '0.4s' }}
          >
            <MapPin className="h-7 w-7 group-hover:animate-bounce-subtle" />
            <span className="font-semibold">Farm Map</span>
          </Button>
          <Button
            className="h-auto py-7 flex-col gap-3 hover:scale-110 transition-all duration-300 bg-gradient-to-br from-muted to-primary/10 hover:from-primary hover:to-accent hover:text-white border-2 border-muted-foreground/20 hover:border-transparent shadow-medium group"
            variant="outline"
            onClick={() => navigate("/manage-farms")}
            style={{ animationDelay: '0.5s' }}
          >
            <Settings className="h-7 w-7 group-hover:animate-spin" />
            <span className="font-semibold">Manage Farms</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-7 hover:shadow-strong transition-all duration-300 animate-scale-in hover:scale-105 bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-accent/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wide">Soil Health Score</h3>
                <div className="p-2 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent mb-2">87/100</div>
              <p className="text-sm font-semibold text-accent flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +5% from last month
              </p>
            </div>
          </Card>

          <Card className="p-7 hover:shadow-strong transition-all duration-300 animate-scale-in hover:scale-105 bg-gradient-to-br from-sky/5 to-primary/5 border-2 border-sky/20 group relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-sky/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wide">Moisture Level</h3>
                <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-br from-sky to-primary bg-clip-text text-transparent mb-2">66%</div>
              <p className="text-sm font-semibold text-primary">Optimal range</p>
            </div>
          </Card>

          <Card className="p-7 hover:shadow-strong transition-all duration-300 animate-scale-in hover:scale-105 bg-gradient-to-br from-destructive/5 to-orange/5 border-2 border-destructive/20 group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wide">Active Alerts</h3>
                <div className="p-2 rounded-xl bg-destructive/20 group-hover:bg-destructive/30 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-destructive animate-pulse" />
                </div>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-br from-destructive to-orange bg-clip-text text-transparent mb-2">2</div>
              <p className="text-sm font-semibold text-muted-foreground">1 high, 1 medium</p>
            </div>
          </Card>

          <Card className="p-7 hover:shadow-strong transition-all duration-300 animate-scale-in hover:scale-105 bg-gradient-to-br from-purple/5 to-primary/5 border-2 border-purple/20 group relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-muted-foreground text-sm uppercase tracking-wide">Farms Managed</h3>
                <div className="p-2 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-br from-purple to-primary bg-clip-text text-transparent mb-2">3</div>
              <p className="text-sm font-semibold text-accent">All monitored</p>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <Card className="p-7 hover:shadow-strong transition-all duration-300 border-2 border-primary/10 bg-gradient-to-br from-card to-primary/5 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">Soil Nutrients Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={soilHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "2px solid hsl(var(--primary))",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-medium)"
                  }}
                />
                <Line type="monotone" dataKey="nitrogen" stroke="hsl(var(--primary))" strokeWidth={3} name="Nitrogen" dot={{ fill: "hsl(var(--primary))", r: 5 }} />
                <Line type="monotone" dataKey="phosphorus" stroke="hsl(var(--accent))" strokeWidth={3} name="Phosphorus" dot={{ fill: "hsl(var(--accent))", r: 5 }} />
                <Line type="monotone" dataKey="potassium" stroke="hsl(var(--sky))" strokeWidth={3} name="Potassium" dot={{ fill: "hsl(var(--sky))", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-7 hover:shadow-strong transition-all duration-300 border-2 border-accent/10 bg-gradient-to-br from-card to-accent/5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-6">Weekly Soil Moisture</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moistureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "2px solid hsl(var(--accent))",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow-medium)"
                  }}
                />
                <Bar dataKey="moisture" fill="url(#colorGradient)" radius={[10, 10, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Farm Health Distribution */}
        <Card className="p-7 hover:shadow-strong transition-all duration-300 border-2 border-primary/10 bg-gradient-to-br from-card to-accent/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-8">Farm Health Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-10">
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
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "2px solid hsl(var(--primary))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-5">
              {farmHealthDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card to-muted/20 hover:to-muted/40 transition-all duration-300 group hover:scale-105">
                  <div 
                    className="h-6 w-6 rounded-lg group-hover:scale-125 transition-transform shadow-medium" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-base text-foreground font-bold flex-grow">{item.name}</span>
                  <span className="text-lg text-muted-foreground font-bold">{item.value}%</span>
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