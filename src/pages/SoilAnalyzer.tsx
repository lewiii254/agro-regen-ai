import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sprout, LogOut, ArrowLeft, Loader2, Download, Share2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import soilImage from "@/assets/soil-health.jpg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SoilAnalyzer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  
  const [soilData, setSoilData] = useState({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicMatter: "",
    moisture: "",
  });

  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchFarms(session.user.id);
      }
    };
    initAuth();
  }, [navigate]);

  const fetchFarms = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("farms")
        .select("id, name, location")
        .eq("user_id", userId);
      
      if (error) throw error;
      setFarms(data || []);
      if (data && data.length > 0) {
        setSelectedFarmId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFarmId) {
      toast.error("Please select a farm first");
      return;
    }

    setAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      const ph = parseFloat(soilData.ph);
      const n = parseFloat(soilData.nitrogen);
      const p = parseFloat(soilData.phosphorus);
      const k = parseFloat(soilData.potassium);
      const om = parseFloat(soilData.organicMatter);
      const moisture = parseFloat(soilData.moisture);

      // Calculate health score
      let score = 0;
      if (ph >= 6.0 && ph <= 7.5) score += 20;
      else if (ph >= 5.5 && ph <= 8.0) score += 10;
      
      if (n >= 40) score += 20;
      else if (n >= 30) score += 15;
      else if (n >= 20) score += 10;
      
      if (p >= 30) score += 20;
      else if (p >= 20) score += 15;
      else if (p >= 10) score += 10;
      
      if (k >= 40) score += 20;
      else if (k >= 30) score += 15;
      else if (k >= 20) score += 10;
      
      if (om >= 5) score += 20;
      else if (om >= 3) score += 15;
      else if (om >= 2) score += 10;

      // Generate recommendations
      const recommendations = [];
      if (ph < 6.0) recommendations.push("🔹 pH is too acidic. Apply lime to raise pH to 6.0-7.0 range.");
      if (ph > 7.5) recommendations.push("🔹 pH is too alkaline. Add sulfur or organic matter to lower pH.");
      if (n < 40) recommendations.push("🔹 Nitrogen levels are low. Consider cover cropping with legumes or adding compost.");
      if (p < 30) recommendations.push("🔹 Phosphorus is deficient. Add rock phosphate or bone meal.");
      if (k < 40) recommendations.push("🔹 Potassium needs improvement. Apply wood ash or greensand.");
      if (om < 3) recommendations.push("🔹 Increase organic matter with compost, mulch, and cover crops.");
      if (score >= 80) recommendations.push("✅ Excellent soil health! Continue current practices.");

      const reportData = {
        healthScore: score,
        recommendations: recommendations.length ? recommendations : ["✅ Your soil is in great condition! Keep up the good work."],
        ph,
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        organicMatter: om,
        moisture,
      };

      setReport(reportData);

      // Save to database
      const { error: insertError } = await supabase
        .from("soil_health_reports")
        .insert({
          farm_id: selectedFarmId,
          ph_level: ph,
          nitrogen_level: n,
          phosphorus_level: p,
          potassium_level: k,
          organic_matter: om,
          moisture_content: moisture,
          health_score: score,
          recommendations: recommendations.join("\n"),
        });

      if (insertError) {
        console.error("Error saving report:", insertError);
        toast.error("Analysis complete, but failed to save report");
      } else {
        toast.success("Analysis complete and saved!");
      }
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const exportReport = () => {
    if (!report) return;
    
    const reportText = `
SOIL HEALTH ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

HEALTH SCORE: ${report.healthScore}/100

SOIL METRICS:
- pH Level: ${report.ph}
- Nitrogen: ${report.nitrogen} ppm
- Phosphorus: ${report.phosphorus} ppm
- Potassium: ${report.potassium} ppm
- Organic Matter: ${report.organicMatter}%
- Moisture Content: ${report.moisture}%

RECOMMENDATIONS:
${report.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n')}

---
Report generated by AgroReGen Soil Analyzer
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soil-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  };

  const shareReport = () => {
    if (!report) return;
    
    const shareText = `My soil health score: ${report.healthScore}/100! Check out AgroReGen for AI-powered soil analysis. 🌱`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Soil Health Report',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Report summary copied to clipboard!");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="bg-gradient-to-r from-card to-card/80 backdrop-blur-md border-b border-border shadow-medium">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="hover:bg-primary/10 hover:scale-110 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Soil Analyzer</h1>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className="hover:bg-destructive hover:text-white transition-all duration-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="p-8 border-2 border-primary/10 shadow-strong hover:shadow-accent transition-all duration-300 animate-fade-in-up">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">Enter Soil Data</h2>
            
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="farm" className="text-base font-semibold">Select Farm</Label>
                <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
                  <SelectTrigger className="h-12 border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="Select a farm" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name} - {farm.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph" className="text-base font-semibold">pH Level (0-14)</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={soilData.ph}
                  onChange={(e) => setSoilData({ ...soilData, ph: e.target.value })}
                  placeholder="6.5"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nitrogen" className="text-base font-semibold">Nitrogen (ppm)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  step="1"
                  min="0"
                  value={soilData.nitrogen}
                  onChange={(e) => setSoilData({ ...soilData, nitrogen: e.target.value })}
                  placeholder="45"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phosphorus" className="text-base font-semibold">Phosphorus (ppm)</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  step="1"
                  min="0"
                  value={soilData.phosphorus}
                  onChange={(e) => setSoilData({ ...soilData, phosphorus: e.target.value })}
                  placeholder="35"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="potassium" className="text-base font-semibold">Potassium (ppm)</Label>
                <Input
                  id="potassium"
                  type="number"
                  step="1"
                  min="0"
                  value={soilData.potassium}
                  onChange={(e) => setSoilData({ ...soilData, potassium: e.target.value })}
                  placeholder="42"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organicMatter" className="text-base font-semibold">Organic Matter (%)</Label>
                <Input
                  id="organicMatter"
                  type="number"
                  step="0.1"
                  min="0"
                  value={soilData.organicMatter}
                  onChange={(e) => setSoilData({ ...soilData, organicMatter: e.target.value })}
                  placeholder="4.2"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moisture" className="text-base font-semibold">Moisture Content (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={soilData.moisture}
                  onChange={(e) => setSoilData({ ...soilData, moisture: e.target.value })}
                  placeholder="65"
                  required
                  className="h-12 border-2 focus:border-primary transition-colors"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-white font-semibold shadow-medium hover:shadow-accent hover:scale-105 transition-all duration-300" 
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Soil Health"
                )}
              </Button>
            </form>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="p-8 animate-fade-in-up border-2 border-accent/10 shadow-strong hover:shadow-accent transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Analysis Results</h2>
                {report && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportReport}
                      className="hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={shareReport}
                      className="hover:bg-accent/10 hover:text-accent hover:scale-110 transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </div>
              
              {report ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-foreground">Health Score</span>
                      <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{report.healthScore}/100</span>
                    </div>
                    <Progress value={report.healthScore} className="h-4" />
                  </div>

                  <div className="pt-6 border-t-2 border-border">
                    <h3 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                      Recommendations
                    </h3>
                    <ul className="space-y-4">
                      {report.recommendations.map((rec: string, index: number) => (
                        <li 
                          key={index} 
                          className="text-muted-foreground leading-relaxed p-4 rounded-xl bg-gradient-to-r from-card to-secondary/20 border border-border hover:border-primary/30 transition-colors"
                        >
                          <span className="text-primary font-semibold mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t-2 border-border">
                    <h3 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                      Detailed Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 hover:scale-105 transition-transform">
                        <p className="text-sm text-muted-foreground font-semibold mb-1">pH Level</p>
                        <p className="text-2xl font-bold text-primary">{report.ph}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/20 hover:scale-105 transition-transform">
                        <p className="text-sm text-muted-foreground font-semibold mb-1">Nitrogen</p>
                        <p className="text-2xl font-bold text-accent">{report.nitrogen} ppm</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 hover:scale-105 transition-transform">
                        <p className="text-sm text-muted-foreground font-semibold mb-1">Phosphorus</p>
                        <p className="text-2xl font-bold text-primary">{report.phosphorus} ppm</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/20 hover:scale-105 transition-transform">
                        <p className="text-sm text-muted-foreground font-semibold mb-1">Potassium</p>
                        <p className="text-2xl font-bold text-accent">{report.potassium} ppm</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Organic Matter</p>
                        <p className="text-lg font-semibold text-foreground">{report.organicMatter}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Moisture</p>
                        <p className="text-lg font-semibold text-foreground">{report.moisture}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <img 
                    src={soilImage} 
                    alt="Healthy soil" 
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <p className="text-muted-foreground">
                    Enter your soil test data to get AI-powered health analysis and recommendations
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalyzer;