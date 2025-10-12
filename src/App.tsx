import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SoilAnalyzer from "./pages/SoilAnalyzer";
import Chatbot from "./pages/Chatbot";
import ClimateAlerts from "./pages/ClimateAlerts";
import CommunityHub from "./pages/CommunityHub";
import FarmMap from "./pages/FarmMap";
import ManageFarms from "./pages/ManageFarms";
import CropYieldPredictor from "./pages/CropYieldPredictor";
import IrrigationManager from "./pages/IrrigationManager";
import PestDiseaseAlerts from "./pages/PestDiseaseAlerts";
import MarketPriceIntelligence from "./pages/MarketPriceIntelligence";
import LearningHub from "./pages/LearningHub";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/soil-analyzer" element={<SoilAnalyzer />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/climate-alerts" element={<ClimateAlerts />} />
          <Route path="/community-hub" element={<CommunityHub />} />
          <Route path="/farm-map" element={<FarmMap />} />
          <Route path="/manage-farms" element={<ManageFarms />} />
          <Route path="/crop-yield" element={<CropYieldPredictor />} />
          <Route path="/irrigation" element={<IrrigationManager />} />
          <Route path="/pest-disease" element={<PestDiseaseAlerts />} />
          <Route path="/market-prices" element={<MarketPriceIntelligence />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
