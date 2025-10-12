import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Play, Eye, Heart, GraduationCap, Search, TrendingUp, Award, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

const LearningHub = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    content_type: string;
    content_url: string;
    difficulty_level: string;
    duration_minutes: number;
    views: number;
    likes: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "recent" | "duration">("popular");

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      } else {
        await seedLearningResources();
        fetchResources();
      }
    };
    initAuth();
  }, [navigate]);

  const seedLearningResources = async () => {
    const sampleResources = [
      {
        title: "Introduction to Regenerative Agriculture",
        description: "Learn the basics of regenerative farming and how it can improve soil health and increase yields.",
        category: "soil_health",
        content_type: "video",
        content_url: "#",
        difficulty_level: "beginner",
        duration_minutes: 15,
        views: 1250,
        likes: 89
      },
      {
        title: "Integrated Pest Management (IPM) Techniques",
        description: "Comprehensive guide to managing pests using sustainable and eco-friendly methods.",
        category: "pest_management",
        content_type: "guide",
        content_url: "#",
        difficulty_level: "intermediate",
        duration_minutes: 30,
        views: 856,
        likes: 67
      },
      {
        title: "Smart Irrigation Systems for Small Farms",
        description: "Step-by-step tutorial on setting up efficient irrigation systems to conserve water.",
        category: "irrigation",
        content_type: "tutorial",
        content_url: "#",
        difficulty_level: "intermediate",
        duration_minutes: 25,
        views: 943,
        likes: 72
      },
      {
        title: "Crop Rotation Planning Made Easy",
        description: "Master the art of crop rotation to maintain soil fertility and reduce pest pressure.",
        category: "crop_rotation",
        content_type: "article",
        content_url: "#",
        difficulty_level: "beginner",
        duration_minutes: 20,
        views: 1102,
        likes: 95
      },
      {
        title: "Climate Adaptation Strategies",
        description: "Learn how to adapt your farming practices to changing climate conditions.",
        category: "climate_adaptation",
        content_type: "video",
        content_url: "#",
        difficulty_level: "advanced",
        duration_minutes: 40,
        views: 678,
        likes: 54
      },
      {
        title: "Soil Testing and Analysis",
        description: "Complete guide to understanding soil test results and taking action.",
        category: "soil_health",
        content_type: "guide",
        content_url: "#",
        difficulty_level: "beginner",
        duration_minutes: 18,
        views: 1523,
        likes: 112
      },
    ];

    try {
      // Check if resources already exist
      const { data: existingData } = await (supabase as any)
        .from("learning_resources")
        .select("id")
        .limit(1);
      
      // Only seed if no resources exist
      if (!existingData || existingData.length === 0) {
        for (const resource of sampleResources) {
          await (supabase as any).from("learning_resources").insert(resource);
        }
      }
    } catch (error) {
      console.error("Error seeding learning resources:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("learning_resources")
        .select("*")
        .order("views", { ascending: false });
      
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "article":
        return <BookOpen className="h-4 w-4" />;
      case "guide":
        return <GraduationCap className="h-4 w-4" />;
      case "tutorial":
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filterByCategory = (category: string) => {
    if (category === "all") return resources;
    return resources.filter(r => r.category === category);
  };

  const filterAndSortResources = (category: string) => {
    let filtered = filterByCategory(category);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.views - a.views);
      case "recent":
        return filtered.sort((a, b) => b.likes - a.likes);
      case "duration":
        return filtered.sort((a, b) => a.duration_minutes - b.duration_minutes);
      default:
        return filtered;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              🎓 Learning & Training Hub
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Educational resources and tutorials on regenerative farming
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">{resources.length}</p>
                  <p className="text-sm text-purple-600">Total Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-900">{resources.reduce((sum, r) => sum + r.views, 0).toLocaleString()}</p>
                  <p className="text-sm text-orange-600">Total Views</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-900">{resources.filter(r => r.difficulty_level === "beginner").length}</p>
                  <p className="text-sm text-pink-600">Beginner Friendly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              size="sm"
            >
              Popular
            </Button>
            <Button
              variant={sortBy === "recent" ? "default" : "outline"}
              onClick={() => setSortBy("recent")}
              size="sm"
            >
              Most Liked
            </Button>
            <Button
              variant={sortBy === "duration" ? "default" : "outline"}
              onClick={() => setSortBy("duration")}
              size="sm"
            >
              Duration
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="soil_health">Soil Health</TabsTrigger>
            <TabsTrigger value="pest_management">Pest Mgmt</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
            <TabsTrigger value="crop_rotation">Crop Rotation</TabsTrigger>
            <TabsTrigger value="climate_adaptation">Climate</TabsTrigger>
          </TabsList>

          {["all", "soil_health", "pest_management", "irrigation", "crop_rotation", "climate_adaptation"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterAndSortResources(category).map((resource) => (
                  <Card key={resource.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                          <span className="flex items-center gap-1">
                            {getContentTypeIcon(resource.content_type)}
                            {resource.content_type}
                          </span>
                        </Badge>
                        <Badge className={getDifficultyColor(resource.difficulty_level)}>
                          {resource.difficulty_level}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-purple-600 transition-colors">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{resource.views.toLocaleString()} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{resource.likes} likes</span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          ⏱️ {resource.duration_minutes} minutes
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1 group-hover:scale-105 transition-transform" variant="outline">
                            {resource.content_type === "video" ? "Watch Now" : "Read More"}
                          </Button>
                          <Button variant="ghost" size="icon" className="group-hover:scale-105 transition-transform">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {!loading && resources.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold text-foreground mb-2">No learning resources available</p>
              <p className="text-muted-foreground">Check back soon for educational content!</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LearningHub;
