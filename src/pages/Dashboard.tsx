import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Sprout,
  LogOut,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Users,
  MapPin,
  Settings,
  Droplets,
  Bug,
  DollarSign,
  BookOpen,
  ShoppingBag,
  LineChart as LineChartIcon,
  Leaf,
  Activity,
  Sparkles,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { NotificationBell } from "@/components/NotificationBell";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user);
      else navigate("/auth");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const soilHealthData = [
    { month: "Jan", nitrogen: 45, phosphorus: 38, potassium: 42 },
    { month: "Feb", nitrogen: 48, phosphorus: 40, potassium: 44 },
    { month: "Mar", nitrogen: 52, phosphorus: 42, potassium: 46 },
    { month: "Apr", nitrogen: 55, phosphorus: 45, potassium: 48 },
    { month: "May", nitrogen: 58, phosphorus: 47, potassium: 50 },
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
    { name: "Fair", value: 15, color: "hsl(var(--warning))" },
    { name: "Needs Attention", value: 5, color: "hsl(var(--destructive))" },
  ];

  type Tool = {
    label: string;
    icon: React.ElementType;
    path: string;
    tone: "primary" | "accent" | "sky" | "warning" | "destructive" | "purple" | "orange";
  };

  const coreTools: Tool[] = [
    { label: "Soil Analyzer", icon: Sprout, path: "/soil-analyzer", tone: "primary" },
    { label: "Climate Alerts", icon: AlertTriangle, path: "/climate-alerts", tone: "warning" },
    { label: "AI Advisor", icon: MessageSquare, path: "/chatbot", tone: "accent" },
    { label: "Community", icon: Users, path: "/community-hub", tone: "purple" },
    { label: "Farm Map", icon: MapPin, path: "/farm-map", tone: "sky" },
    { label: "Manage Farms", icon: Settings, path: "/manage-farms", tone: "primary" },
  ];

  const smartTools: Tool[] = [
    { label: "Yield Predictor", icon: TrendingUp, path: "/crop-yield", tone: "primary" },
    { label: "Irrigation", icon: Droplets, path: "/irrigation", tone: "sky" },
    { label: "Pest Alerts", icon: Bug, path: "/pest-disease", tone: "destructive" },
    { label: "Market Prices", icon: DollarSign, path: "/market-prices", tone: "accent" },
    { label: "Learning Hub", icon: BookOpen, path: "/learning-hub", tone: "purple" },
    { label: "Marketplace", icon: ShoppingBag, path: "/marketplace", tone: "orange" },
  ];

  const toneMap: Record<Tool["tone"], { bg: string; ring: string; icon: string; glow: string }> = {
    primary: { bg: "bg-primary/10", ring: "group-hover:ring-primary/40", icon: "text-primary", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]" },
    accent: { bg: "bg-accent/10", ring: "group-hover:ring-accent/40", icon: "text-accent", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.5)]" },
    sky: { bg: "bg-[hsl(var(--sky))]/10", ring: "group-hover:ring-[hsl(var(--sky))]/40", icon: "text-[hsl(var(--sky))]", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--sky)/0.5)]" },
    warning: { bg: "bg-[hsl(var(--warning))]/10", ring: "group-hover:ring-[hsl(var(--warning))]/40", icon: "text-[hsl(var(--warning))]", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--warning)/0.5)]" },
    destructive: { bg: "bg-destructive/10", ring: "group-hover:ring-destructive/40", icon: "text-destructive", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--destructive)/0.5)]" },
    purple: { bg: "bg-[hsl(var(--purple))]/10", ring: "group-hover:ring-[hsl(var(--purple))]/40", icon: "text-[hsl(var(--purple))]", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--purple)/0.5)]" },
    orange: { bg: "bg-[hsl(var(--orange))]/10", ring: "group-hover:ring-[hsl(var(--orange))]/40", icon: "text-[hsl(var(--orange))]", glow: "group-hover:shadow-[0_0_30px_-5px_hsl(var(--orange)/0.5)]" },
  };

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const t = toneMap[tool.tone];
    const Icon = tool.icon;
    return (
      <button
        onClick={() => navigate(tool.path)}
        className={`group relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-card border border-border ring-1 ring-transparent ${t.ring} ${t.glow} transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden`}
      >
        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${t.bg} blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
        <div className={`relative h-11 w-11 rounded-xl ${t.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon className={`h-5 w-5 ${t.icon}`} />
        </div>
        <div className="relative">
          <p className="font-semibold text-sm text-foreground">{tool.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Open tool →</p>
        </div>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Sprout className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-[hsl(var(--sky))]/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Agro<span className="text-primary">ReGen</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-[hsl(var(--sky))]/10 p-8 md:p-10 animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1.5">
                <Sparkles className="h-3 w-3" />
                Live monitoring active
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {user?.user_metadata?.full_name?.split(" ")[0] || "Farmer"}
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2 max-w-xl">
                Your farms are thriving. Here's a real-time snapshot of soil, climate and yield insights.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate("/chatbot")} className="gap-2 shadow-soft">
                <MessageSquare className="h-4 w-4" /> Ask AI Advisor
              </Button>
              <Button variant="outline" onClick={() => navigate("/manage-farms")} className="gap-2">
                <Settings className="h-4 w-4" /> Manage Farms
              </Button>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Soil Health", value: "87", suffix: "/100", trend: "+5%", icon: Leaf, tone: "accent" as const },
            { label: "Moisture", value: "66", suffix: "%", trend: "Optimal", icon: Droplets, tone: "sky" as const },
            { label: "Active Alerts", value: "2", suffix: "", trend: "1 high · 1 medium", icon: AlertTriangle, tone: "warning" as const },
            { label: "Farms Managed", value: "3", suffix: "", trend: "All monitored", icon: MapPin, tone: "primary" as const },
          ].map((m, i) => {
            const t = toneMap[m.tone];
            const Icon = m.icon;
            return (
              <Card
                key={m.label}
                className={`relative overflow-hidden p-5 border-border hover:-translate-y-1 transition-all duration-300 ${t.glow} animate-fade-in-up`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full ${t.bg} blur-2xl`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{m.label}</p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground">{m.value}</span>
                      <span className="text-lg text-muted-foreground font-semibold">{m.suffix}</span>
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-muted-foreground">{m.trend}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-xl ${t.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${t.icon}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Tools */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 rounded-full bg-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Core Features</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {coreTools.map((t) => <ToolCard key={t.path} tool={t} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-8 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold tracking-tight">Smart Tools & Marketplace</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {smartTools.map((t) => <ToolCard key={t.path} tool={t} />)}
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="grid lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-6 border-border">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Soil Nutrients Trend</h3>
                <p className="text-sm text-muted-foreground">Last 5 months · NPK levels</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <LineChartIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={soilHealthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-medium)",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="nitrogen" stroke="hsl(var(--primary))" strokeWidth={2.5} name="Nitrogen" dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                <Line type="monotone" dataKey="phosphorus" stroke="hsl(var(--accent))" strokeWidth={2.5} name="Phosphorus" dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                <Line type="monotone" dataKey="potassium" stroke="hsl(var(--sky))" strokeWidth={2.5} name="Potassium" dot={{ fill: "hsl(var(--sky))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">Soil Moisture</h3>
                <p className="text-sm text-muted-foreground">This week</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-[hsl(var(--sky))]/10 flex items-center justify-center">
                <Droplets className="h-4 w-4 text-[hsl(var(--sky))]" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={moistureData}>
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--sky))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--sky))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="moisture" stroke="hsl(var(--sky))" strokeWidth={2.5} fill="url(#moistureGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Farm Health */}
        <Card className="p-6 md:p-8 border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Farm Health Distribution</h3>
              <p className="text-sm text-muted-foreground">Across all monitored plots</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-accent" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={farmHealthDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {farmHealthDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {farmHealthDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="flex-grow font-medium text-sm">{item.name}</span>
                  <span className="text-sm font-bold tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
