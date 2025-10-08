import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import L from "leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Farm {
  id: string;
  name: string;
  location: string;
  soil_type: string | null;
  latitude: number | null;
  longitude: number | null;
  size_hectares: number | null;
}

const FarmMap = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([-0.0236, 37.9062]);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("farms")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const farmsWithCoords = (data || []).filter(
        (farm) => farm.latitude !== null && farm.longitude !== null
      );

      setFarms(farmsWithCoords);

      if (farmsWithCoords.length > 0) {
        // Calculate center of all farms
        const avgLat =
          farmsWithCoords.reduce((sum, farm) => sum + (farm.latitude || 0), 0) /
          farmsWithCoords.length;
        const avgLng =
          farmsWithCoords.reduce((sum, farm) => sum + (farm.longitude || 0), 0) /
          farmsWithCoords.length;
        setMapCenter([avgLat, avgLng]);
      } else {
        // Default to Kenya's approximate center
        setMapCenter([-0.0236, 37.9062]);
      }
    } catch (error: any) {
      toast.error("Failed to fetch farms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Farm Map</h1>
            <p className="text-muted-foreground mt-2">
              Visualize your farms and their locations
            </p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-pulse">Loading map...</div>
            </CardContent>
          </Card>
        ) : farms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-foreground">No farms with coordinates</p>
              <p className="text-muted-foreground mt-2">
                Add latitude and longitude to your farms to see them on the map
              </p>
              <Button className="mt-6" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div style={{ height: "600px", width: "100%" }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={8}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {farms.map((farm) => (
                        <Marker
                          key={farm.id}
                          position={[farm.latitude!, farm.longitude!] as LatLngExpression}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-base">{farm.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {farm.location}
                              </p>
                              {farm.size_hectares && (
                                <p className="text-sm mt-1">
                                  Size: {farm.size_hectares} hectares
                                </p>
                              )}
                              {farm.soil_type && (
                                <p className="text-sm">Soil: {farm.soil_type}</p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Farms</CardTitle>
                  <CardDescription>
                    {farms.length} {farms.length === 1 ? "farm" : "farms"} with GPS coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {farms.map((farm) => (
                      <div
                        key={farm.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          setMapCenter([farm.latitude!, farm.longitude!] as LatLngExpression);
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{farm.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {farm.location}
                            </p>
                            {farm.size_hectares && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {farm.size_hectares} ha
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmMap;
