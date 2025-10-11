import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Farm {
  id: string;
  name: string;
  location: string;
  soil_type: string | null;
  latitude: number | null;
  longitude: number | null;
  size_hectares: number | null;
}

const ManageFarms = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    soil_type: "",
    latitude: "",
    longitude: "",
    size_hectares: "",
  });

  useEffect(() => {
    checkAuth();
    fetchFarms();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchFarms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("farms")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFarms(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch farms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const farmData = {
        name: formData.name,
        location: formData.location,
        soil_type: formData.soil_type || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        size_hectares: formData.size_hectares ? parseFloat(formData.size_hectares) : null,
        user_id: user.id,
      };

      if (editingFarm) {
        const { error } = await supabase
          .from("farms")
          .update(farmData)
          .eq("id", editingFarm.id);

        if (error) throw error;
        toast.success("Farm updated successfully!");
      } else {
        const { error } = await supabase.from("farms").insert(farmData);

        if (error) throw error;
        toast.success("Farm added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFarms();
    } catch (error: any) {
      toast.error("Failed to save farm");
      console.error(error);
    }
  };

  const handleDelete = async (farmId: string) => {
    if (!confirm("Are you sure you want to delete this farm?")) return;

    try {
      const { error } = await supabase.from("farms").delete().eq("id", farmId);

      if (error) throw error;
      toast.success("Farm deleted successfully!");
      fetchFarms();
    } catch (error: any) {
      toast.error("Failed to delete farm");
      console.error(error);
    }
  };

  const openEditDialog = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      location: farm.location,
      soil_type: farm.soil_type || "",
      latitude: farm.latitude?.toString() || "",
      longitude: farm.longitude?.toString() || "",
      size_hectares: farm.size_hectares?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      soil_type: "",
      latitude: "",
      longitude: "",
      size_hectares: "",
    });
    setEditingFarm(null);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Manage Farms</h1>
              <p className="text-muted-foreground mt-2">
                Add and edit your farm locations with GPS coordinates
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Farm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFarm ? "Edit Farm" : "Add New Farm"}
                </DialogTitle>
                <DialogDescription>
                  Enter farm details including GPS coordinates for map visualization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Farm Name *</Label>
                    <Input
                      id="name"
                      placeholder="Green Valley Farm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Kiambu County"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="soil_type">Soil Type</Label>
                    <Input
                      id="soil_type"
                      placeholder="Loamy"
                      value={formData.soil_type}
                      onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size_hectares">Size (hectares)</Label>
                    <Input
                      id="size_hectares"
                      type="number"
                      step="0.1"
                      placeholder="5.2"
                      value={formData.size_hectares}
                      onChange={(e) => setFormData({ ...formData, size_hectares: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="-1.2921"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: -1.2921 (for Nairobi)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="36.8219"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Example: 36.8219 (for Nairobi)
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFarm ? "Update Farm" : "Add Farm"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : farms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground">No farms yet</p>
              <p className="text-muted-foreground mt-2">
                Add your first farm to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <Card key={farm.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{farm.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {farm.location}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(farm)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(farm.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {farm.soil_type && (
                      <p>
                        <span className="text-muted-foreground">Soil Type:</span>{" "}
                        <span className="font-medium">{farm.soil_type}</span>
                      </p>
                    )}
                    {farm.size_hectares && (
                      <p>
                        <span className="text-muted-foreground">Size:</span>{" "}
                        <span className="font-medium">{farm.size_hectares} hectares</span>
                      </p>
                    )}
                    {farm.latitude && farm.longitude && (
                      <p>
                        <span className="text-muted-foreground">GPS:</span>{" "}
                        <span className="font-medium font-mono text-xs">
                          {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                        </span>
                      </p>
                    )}
                    {(!farm.latitude || !farm.longitude) && (
                      <p className="text-xs text-destructive">
                        ⚠️ Missing GPS coordinates - won't appear on map
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFarms;
