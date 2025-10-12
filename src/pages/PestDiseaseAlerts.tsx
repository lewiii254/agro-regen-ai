import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Bug, AlertTriangle, CheckCircle2, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const PestDiseaseAlerts = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Array<{ id: string; name: string; location: string }>>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    alert_type: string;
    severity: string;
    pest_disease_name: string;
    affected_area: string;
    symptoms: string;
    treatment_recommendations: string;
    detected_date: string;
    is_resolved: boolean;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    alertType: "",
    severity: "",
    name: "",
    affectedArea: "",
    symptoms: "",
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
        fetchAlerts(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const fetchAlerts = async (farmId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("pest_disease_alerts")
        .select("*")
        .eq("farm_id", farmId)
        .order("detected_date", { ascending: false });
      
      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const getTreatmentRecommendation = (type: string, name: string) => {
    const treatments: Record<string, string> = {
      "pest": "Apply organic neem oil spray. Introduce beneficial insects. Use pheromone traps.",
      "disease": "Remove infected plants. Apply copper-based fungicide. Improve air circulation.",
      "weed": "Manual removal. Mulching to suppress growth. Use organic herbicides sparingly.",
    };
    return treatments[type] || "Consult local agricultural extension officer for specific treatment.";
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId || !formData.alertType || !formData.severity || !formData.name) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("pest_disease_alerts")
        .insert({
          farm_id: selectedFarmId,
          alert_type: formData.alertType,
          severity: formData.severity,
          pest_disease_name: formData.name,
          affected_area: formData.affectedArea,
          symptoms: formData.symptoms,
          treatment_recommendations: getTreatmentRecommendation(formData.alertType, formData.name),
          detected_date: new Date().toISOString(),
          is_resolved: false,
        });

      if (error) throw error;

      toast.success("Alert created successfully!");
      fetchAlerts(selectedFarmId);
      setFormData({ alertType: "", severity: "", name: "", affectedArea: "", symptoms: "" });
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Failed to create alert");
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (alertId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("pest_disease_alerts")
        .update({ is_resolved: true })
        .eq("id", alertId);

      if (error) throw error;

      toast.success("Alert marked as resolved");
      fetchAlerts(selectedFarmId);
    } catch (error) {
      console.error("Error updating alert:", error);
      toast.error("Failed to update alert");
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "low":
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pest":
        return <Bug className="h-5 w-5" />;
      case "disease":
        return <AlertTriangle className="h-5 w-5" />;
      case "weed":
        return <Leaf className="h-5 w-5" />;
      default:
        return <Bug className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              🐛 Pest & Disease Alerts
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Early detection and treatment recommendations
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-600" />
                Report Issue
              </CardTitle>
              <CardDescription>Document pest or disease detection</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAlert} className="space-y-4">
                <div>
                  <Label>Select Farm</Label>
                  <Select value={selectedFarmId} onValueChange={(value) => {
                    setSelectedFarmId(value);
                    fetchAlerts(value);
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
                  <Label>Alert Type</Label>
                  <Select value={formData.alertType} onValueChange={(value) => 
                    setFormData({ ...formData, alertType: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pest">Pest</SelectItem>
                      <SelectItem value="disease">Disease</SelectItem>
                      <SelectItem value="weed">Weed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Severity</Label>
                  <Select value={formData.severity} onValueChange={(value) => 
                    setFormData({ ...formData, severity: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pest/Disease Name</Label>
                  <Input
                    placeholder="e.g., Fall Armyworm, Leaf Blight"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Affected Area (Optional)</Label>
                  <Input
                    placeholder="e.g., North Field, Section A"
                    value={formData.affectedArea}
                    onChange={(e) => setFormData({ ...formData, affectedArea: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Symptoms (Optional)</Label>
                  <Textarea
                    placeholder="Describe visible symptoms..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Alert..." : "Create Alert"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Active Alerts
              </CardTitle>
              <CardDescription>Current pest and disease issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No alerts yet. Great news for your farm!
                  </p>
                ) : (
                  alerts.map((alert) => (
                    <Card 
                      key={alert.id} 
                      className={`p-4 ${alert.is_resolved ? "opacity-60" : ""} transition-all duration-300 hover:shadow-md`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(alert.alert_type)}
                          <div>
                            <h3 className="font-semibold text-lg">{alert.pest_disease_name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{alert.alert_type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.is_resolved && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>

                      {alert.affected_area && (
                        <p className="text-sm text-muted-foreground mb-2">
                          📍 {alert.affected_area}
                        </p>
                      )}

                      {alert.symptoms && (
                        <p className="text-sm mb-3 bg-yellow-50 p-2 rounded border border-yellow-200">
                          <strong>Symptoms:</strong> {alert.symptoms}
                        </p>
                      )}

                      <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-3">
                        <p className="text-sm font-semibold mb-1">💡 Treatment Recommendations:</p>
                        <p className="text-sm">{alert.treatment_recommendations}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Detected: {new Date(alert.detected_date).toLocaleDateString()}</span>
                        {!alert.is_resolved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsResolved(alert.id)}
                            className="text-xs"
                          >
                            Mark as Resolved
                          </Button>
                        )}
                      </div>
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

export default PestDiseaseAlerts;
