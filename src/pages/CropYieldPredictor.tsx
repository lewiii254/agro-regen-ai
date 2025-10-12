import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp, Calendar, Sprout } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const CropYieldPredictor = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Array<{ id: string; name: string; location: string }>>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>("");
  const [predictions, setPredictions] = useState<Array<{
    id: string;
    crop_type: string;
    predicted_yield: number;
    confidence_score: number;
    planting_date: string;
    expected_harvest_date: string;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
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
        fetchPredictions(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching farms:", error);
    }
  };

  const fetchPredictions = async (farmId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("crop_yield_predictions")
        .select("*")
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId || !formData.cropType || !formData.plantingDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI prediction (in production, this would call an ML model)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock prediction calculation
      const baseYield = {
        "Maize": 4.5,
        "Wheat": 3.2,
        "Rice": 5.1,
        "Beans": 1.8,
        "Potatoes": 25.0,
        "Tomatoes": 40.0,
      }[formData.cropType] || 3.0;

      const confidence = 0.75 + Math.random() * 0.2;
      const predictedYield = baseYield * (0.9 + Math.random() * 0.3);

      const { error } = await (supabase as any)
        .from("crop_yield_predictions")
        .insert({
          farm_id: selectedFarmId,
          crop_type: formData.cropType,
          predicted_yield: parseFloat(predictedYield.toFixed(2)),
          confidence_score: parseFloat(confidence.toFixed(2)),
          planting_date: formData.plantingDate,
          expected_harvest_date: formData.expectedHarvestDate,
        });

      if (error) throw error;

      toast.success("Yield prediction generated successfully!");
      fetchPredictions(selectedFarmId);
      setFormData({ cropType: "", plantingDate: "", expectedHarvestDate: "" });
    } catch (error) {
      console.error("Error creating prediction:", error);
      toast.error("Failed to generate prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              📊 Crop Yield Predictor
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              AI-powered yield forecasting and harvest planning
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                New Prediction
              </CardTitle>
              <CardDescription>Generate yield forecast for your crop</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <Label>Select Farm</Label>
                  <Select value={selectedFarmId} onValueChange={(value) => {
                    setSelectedFarmId(value);
                    fetchPredictions(value);
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
                  <Label>Crop Type</Label>
                  <Select value={formData.cropType} onValueChange={(value) => 
                    setFormData({ ...formData, cropType: value })
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maize">Maize</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Beans">Beans</SelectItem>
                      <SelectItem value="Potatoes">Potatoes</SelectItem>
                      <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Planting Date</Label>
                  <Input
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Expected Harvest Date</Label>
                  <Input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating Prediction..." : "Generate Prediction"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Prediction History
              </CardTitle>
              <CardDescription>Recent yield predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No predictions yet. Create your first prediction!
                  </p>
                ) : (
                  predictions.map((pred) => (
                    <Card key={pred.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{pred.crop_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            Planted: {new Date(pred.planting_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {pred.predicted_yield} tons/ha
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(pred.confidence_score * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={pred.confidence_score * 100} className="h-2" />
                      {pred.expected_harvest_date && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Harvest: {new Date(pred.expected_harvest_date).toLocaleDateString()}
                        </div>
                      )}
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

export default CropYieldPredictor;
