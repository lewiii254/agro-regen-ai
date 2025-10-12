import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Users, TreePine, Target, CheckCircle2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
}

const Marketplace = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
        investors_count: 12
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
        investors_count: 18
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
        investors_count: 7
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
        investors_count: 25
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
        investors_count: 15
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
        investors_count: 20
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
                {filterByStatus(status).map((project) => (
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
                      </div>

                      <Button className="w-full group-hover:scale-105 transition-transform" variant={project.status === "completed" ? "outline" : "default"}>
                        {project.status === "completed" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            View Results
                          </>
                        ) : (
                          <>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Invest Now
                          </>
                        )}
                      </Button>
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
