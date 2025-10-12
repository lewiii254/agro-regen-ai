import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Droplets, Calendar, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const IrrigationManager = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Array<{ id: string; name: string; location: string }>>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [schedules, setSchedules] = useState<Array<{
    id: string;
    schedule_name: string;
    water_amount_liters: number;
    frequency: string;
    next_irrigation_date: string;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduleName: "",
    waterAmount: "",
    frequency: "",
  });

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
      } else {
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
        fetchSchedules(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const fetchSchedules = async (farmId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("irrigation_schedules")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const calculateNextIrrigation = (frequency: string) => {
    const now = new Date();
    switch (frequency) {
      case "daily":
        now.setDate(now.getDate() + 1);
        break;
      case "weekly":
        now.setDate(now.getDate() + 7);
        break;
      case "bi-weekly":
        now.setDate(now.getDate() + 14);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    return now.toISOString();
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId || !formData.scheduleName || !formData.waterAmount || !formData.frequency) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("irrigation_schedules")
        .insert({
          farm_id: selectedFarmId,
          schedule_name: formData.scheduleName,
          water_amount_liters: parseFloat(formData.waterAmount),
          frequency: formData.frequency,
          next_irrigation_date: calculateNextIrrigation(formData.frequency),
          status: "active",
        });

      if (error) throw error;

      toast.success("Irrigation schedule created successfully!");
      fetchSchedules(selectedFarmId);
      setFormData({ scheduleName: "", waterAmount: "", frequency: "" });
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  const toggleScheduleStatus = async (scheduleId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      const { error } = await (supabase as any)
        .from("irrigation_schedules")
        .update({ status: newStatus })
        .eq("id", scheduleId);

      if (error) throw error;

      toast.success(`Schedule ${newStatus === "active" ? "activated" : "paused"}`);
      fetchSchedules(selectedFarmId);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              💧 Smart Irrigation Manager
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Optimize water usage with intelligent scheduling
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                Create Schedule
              </CardTitle>
              <CardDescription>Set up automated irrigation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div>
                  <Label>Select Farm</Label>
                  <Select value={selectedFarmId} onValueChange={(value) => {
                    setSelectedFarmId(value);
                    fetchSchedules(value);
                  }}>
                    <SelectTrigger>
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

                <div>
                  <Label>Schedule Name</Label>
                  <Input
                    placeholder="e.g., Morning Irrigation"
                    value={formData.scheduleName}
                    onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Water Amount (Liters)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.waterAmount}
                    onChange={(e) => setFormData({ ...formData, waterAmount: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => 
                    setFormData({ ...formData, frequency: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating..." : "Create Schedule"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-600" />
                Active Schedules
              </CardTitle>
              <CardDescription>Manage your irrigation schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No schedules yet. Create your first schedule!
                  </p>
                ) : (
                  schedules.map((schedule) => (
                    <Card key={schedule.id} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{schedule.schedule_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {schedule.water_amount_liters} liters • {schedule.frequency}
                          </p>
                        </div>
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </div>
                      
                      {schedule.next_irrigation_date && (
                        <div className="flex items-center gap-2 mb-3 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Next: {new Date(schedule.next_irrigation_date).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleScheduleStatus(schedule.id, schedule.status)}
                        className="w-full"
                      >
                        {schedule.status === "active" ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IrrigationManager;
