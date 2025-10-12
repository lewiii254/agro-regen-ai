import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Users, TreePine, Target, CheckCircle2, TrendingUp, Search, Filter, Mail, Phone, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Footer from "@/components/Footer";

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  area_hectares: number;
  funding_goal: number;
  funding_raised: number;
  status: "seeking_funding" | "in_progress" | "completed";
  project_type: "reforestation" | "soil_restoration" | "water_management" | "biodiversity";
  impact_score: number;
  landowner: string;
  investors_count: number;
  contact_email?: string;
  contact_phone?: string;
  start_date?: string;
  estimated_completion?: string;
  milestones?: string[];
  min_investment?: number;
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"funding" | "impact" | "area">("funding");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadSampleProjects();
      }
    };
    initAuth();
  }, [navigate]);

  const loadSampleProjects = () => {
    const sampleProjects: Project[] = [
      {
        id: "1",
        title: "Kibwezi Forest Restoration Project",
        description: "Restore 150 hectares of degraded land into a thriving indigenous forest ecosystem with carbon sequestration and biodiversity benefits.",
        location: "Kibwezi, Makueni County",
        area_hectares: 150,
        funding_goal: 750000,
        funding_raised: 450000,
        status: "seeking_funding",
        project_type: "reforestation",
        impact_score: 92,
        landowner: "Kibwezi Community Land Trust",
        investors_count: 12,
        contact_email: "info@kibweziforest.org",
        contact_phone: "+254-700-123456",
        start_date: "2024-03-15",
        estimated_completion: "2027-03-15",
        milestones: [
          "Site preparation and soil testing - Completed",
          "Native tree seedling nursery - In Progress",
          "Initial planting phase (50 ha) - Upcoming",
          "Water retention systems - Planned"
        ],
        min_investment: 5000
      },
      {
        id: "2",
        title: "Narok Soil Health Recovery",
        description: "Transform degraded pasturelands through regenerative grazing and soil restoration techniques, improving land productivity by 300%.",
        location: "Narok County",
        area_hectares: 200,
        funding_goal: 500000,
        funding_raised: 500000,
        status: "in_progress",
        project_type: "soil_restoration",
        impact_score: 88,
        landowner: "Maasai Land Cooperative",
        investors_count: 18,
        contact_email: "contact@naroksoil.org",
        contact_phone: "+254-722-234567",
        start_date: "2023-11-01",
        estimated_completion: "2025-11-01",
        milestones: [
          "Baseline soil testing - Completed",
          "Rotational grazing setup - Completed",
          "Cover crop planting - In Progress",
          "Soil carbon monitoring - Ongoing"
        ],
        min_investment: 3000
      },
      {
        id: "3",
        title: "Kericho Watershed Management",
        description: "Implement comprehensive water conservation and management systems to restore natural water cycles and prevent erosion.",
        location: "Kericho County",
        area_hectares: 100,
        funding_goal: 350000,
        funding_raised: 120000,
        status: "seeking_funding",
        project_type: "water_management",
        impact_score: 85,
        landowner: "Kericho Farmers Association",
        investors_count: 7,
        contact_email: "watershed@kericho.org",
        contact_phone: "+254-733-345678",
        start_date: "2024-06-01",
        estimated_completion: "2026-06-01",
        milestones: [
          "Watershed mapping - Completed",
          "Contour bunding design - In Progress",
          "Water harvesting structures - Planned",
          "Riparian restoration - Planned"
        ],
        min_investment: 2500
      },
      {
        id: "4",
        title: "Laikipia Biodiversity Corridor",
        description: "Create wildlife corridors and restore native habitats to enhance biodiversity and ecosystem services across 250 hectares.",
        location: "Laikipia County",
        area_hectares: 250,
        funding_goal: 900000,
        funding_raised: 900000,
        status: "completed",
        project_type: "biodiversity",
        impact_score: 95,
        landowner: "Laikipia Wildlife Conservancy",
        investors_count: 25,
        contact_email: "info@laikipiacorridor.org",
        contact_phone: "+254-744-456789",
        start_date: "2022-01-15",
        estimated_completion: "2024-01-15",
        milestones: [
          "Corridor route planning - Completed",
          "Native vegetation restoration - Completed",
          "Wildlife monitoring systems - Completed",
          "Community engagement - Completed"
        ],
        min_investment: 10000
      },
      {
        id: "5",
        title: "Meru Agroforestry Initiative",
        description: "Integrate trees with crops to restore soil health, increase farmer income, and sequester carbon in degraded farmlands.",
        location: "Meru County",
        area_hectares: 175,
        funding_goal: 600000,
        funding_raised: 380000,
        status: "seeking_funding",
        project_type: "reforestation",
        impact_score: 90,
        landowner: "Meru Smallholder Farmers Group",
        investors_count: 15,
        contact_email: "agroforest@meru.org",
        contact_phone: "+254-755-567890",
        start_date: "2024-05-01",
        estimated_completion: "2027-05-01",
        milestones: [
          "Farmer training programs - Completed",
          "Tree species selection - Completed",
          "Demonstration plots - In Progress",
          "Full-scale implementation - Planned"
        ],
        min_investment: 4000
      },
      {
        id: "6",
        title: "Kajiado Rangeland Restoration",
        description: "Restore overgrazed rangelands using holistic management practices, improving grass cover and soil carbon by 250%.",
        location: "Kajiado County",
        area_hectares: 300,
        funding_goal: 800000,
        funding_raised: 650000,
        status: "in_progress",
        project_type: "soil_restoration",
        impact_score: 87,
        landowner: "Kajiado Pastoralist Network",
        investors_count: 20,
        contact_email: "rangeland@kajiado.org",
        contact_phone: "+254-766-678901",
        start_date: "2023-08-01",
        estimated_completion: "2025-08-01",
        milestones: [
          "Grazing plan development - Completed",
          "Fence installation - Completed",
          "Grass reseeding - In Progress",
          "Carbon measurement - Ongoing"
        ],
        min_investment: 3500
      }
    ];
    
    setProjects(sampleProjects);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "seeking_funding":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case "reforestation":
        return <TreePine className="h-4 w-4" />;
      case "soil_restoration":
        return <Target className="h-4 w-4" />;
      case "water_management":
        return <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
      case "biodiversity":
        return <Users className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const filterByStatus = (status: string) => {
    if (status === "all") return projects;
    return projects.filter(p => p.status === status);
  };

  const getFundingPercentage = (project: Project) => {
    return Math.round((project.funding_raised / project.funding_goal) * 100);
  };

  const filterAndSortProjects = (status: string) => {
    let filtered = filterByStatus(status);
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(p => p.project_type === filterType);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "funding":
        return filtered.sort((a, b) => getFundingPercentage(b) - getFundingPercentage(a));
      case "impact":
        return filtered.sort((a, b) => b.impact_score - a.impact_score);
      case "area":
        return filtered.sort((a, b) => b.area_hectares - a.area_hectares);
      default:
        return filtered;
    }
  };

  const handleInvestment = () => {
    if (!selectedProject || !investmentAmount) {
      toast.error("Please enter investment amount");
      return;
    }

    const amount = parseFloat(investmentAmount);
    if (amount < (selectedProject.min_investment || 1000)) {
      toast.error(`Minimum investment is $${(selectedProject.min_investment || 1000).toLocaleString()}`);
      return;
    }

    // Simulate investment
    toast.success(`Investment of $${amount.toLocaleString()} submitted successfully!`);
    setInvestmentAmount("");
    setSelectedProject(null);
  };

  const handleContactLandowner = (project: Project) => {
    toast.success(`Contact request sent to ${project.landowner}`);
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
              🌍 Restoration Marketplace
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Connect landowners with investors for verified restoration projects
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{projects.length}</p>
                  <p className="text-sm text-emerald-600">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-900">{projects.reduce((sum, p) => sum + p.area_hectares, 0)}</p>
                  <p className="text-sm text-cyan-600">Hectares Restored</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-teal-900">
                    ${(projects.reduce((sum, p) => sum + p.funding_raised, 0) / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-teal-600">Total Investment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{projects.reduce((sum, p) => sum + p.investors_count, 0)}</p>
                  <p className="text-sm text-blue-600">Total Investors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="reforestation">Reforestation</SelectItem>
              <SelectItem value="soil_restoration">Soil Restoration</SelectItem>
              <SelectItem value="water_management">Water Management</SelectItem>
              <SelectItem value="biodiversity">Biodiversity</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: "funding" | "impact" | "area") => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funding">Funding Progress</SelectItem>
              <SelectItem value="impact">Impact Score</SelectItem>
              <SelectItem value="area">Area Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="seeking_funding">Seeking Funding</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "seeking_funding", "in_progress", "completed"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterAndSortProjects(status).map((project) => (
                  <Card key={project.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-teal-100 text-teal-800 border-teal-300">
                          <span className="flex items-center gap-1">
                            {getProjectTypeIcon(project.project_type)}
                            {project.project_type.replace("_", " ")}
                          </span>
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-semibold text-emerald-600">{getFundingPercentage(project)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getFundingPercentage(project)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${(project.funding_raised / 1000).toFixed(0)}K raised</span>
                          <span>${(project.funding_goal / 1000).toFixed(0)}K goal</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Area</p>
                          <p className="text-sm font-semibold">{project.area_hectares} ha</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Impact Score</p>
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                            {project.impact_score}/100
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{project.investors_count} investors</span>
                        </div>
                        {project.min_investment && (
                          <span className="text-xs text-muted-foreground">Min: ${project.min_investment.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="flex-1 group-hover:scale-105 transition-transform" 
                              variant={project.status === "completed" ? "outline" : "default"}
                              onClick={() => setSelectedProject(project)}
                            >
                              {project.status === "completed" ? (
                                <>
                                  <Info className="mr-2 h-4 w-4" />
                                  Details
                                </>
                              ) : (
                                <>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Invest
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{selectedProject?.title}</DialogTitle>
                              <DialogDescription>{selectedProject?.description}</DialogDescription>
                            </DialogHeader>
                            {selectedProject && (
                              <div className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                                    <p className="text-sm">{selectedProject.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Area</p>
                                    <p className="text-sm">{selectedProject.area_hectares} hectares</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Impact Score</p>
                                    <p className="text-sm font-semibold text-emerald-600">{selectedProject.impact_score}/100</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge className={getStatusColor(selectedProject.status)}>
                                      {selectedProject.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                </div>

                                {selectedProject.milestones && (
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Project Milestones</p>
                                    <ul className="space-y-2">
                                      {selectedProject.milestones.map((milestone, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                                          {milestone}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  {selectedProject.start_date && (
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                      <p className="text-sm">{new Date(selectedProject.start_date).toLocaleDateString()}</p>
                                    </div>
                                  )}
                                  {selectedProject.estimated_completion && (
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Est. Completion</p>
                                      <p className="text-sm">{new Date(selectedProject.estimated_completion).toLocaleDateString()}</p>
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-muted-foreground mb-2">Contact Information</p>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{selectedProject.contact_email || "Not available"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{selectedProject.contact_phone || "Not available"}</span>
                                    </div>
                                  </div>
                                </div>

                                {selectedProject.status !== "completed" && (
                                  <div className="border-t pt-4">
                                    <Label htmlFor="investment-amount">Investment Amount (USD)</Label>
                                    <Input
                                      id="investment-amount"
                                      type="number"
                                      placeholder={`Min: $${(selectedProject.min_investment || 1000).toLocaleString()}`}
                                      value={investmentAmount}
                                      onChange={(e) => setInvestmentAmount(e.target.value)}
                                      className="mt-2"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Minimum investment: ${(selectedProject.min_investment || 1000).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter className="gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => selectedProject && handleContactLandowner(selectedProject)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Contact Landowner
                              </Button>
                              {selectedProject?.status !== "completed" && (
                                <Button onClick={handleInvestment}>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Invest Now
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {!loading && projects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">No projects available</p>
              <p className="text-muted-foreground">Check back soon for restoration opportunities!</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;
