-- Add crop yield predictions table
CREATE TABLE public.crop_yield_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  predicted_yield DECIMAL(10, 2),
  confidence_score DECIMAL(3, 2),
  planting_date DATE,
  expected_harvest_date DATE,
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add irrigation schedules table
CREATE TABLE public.irrigation_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  water_amount_liters DECIMAL(10, 2),
  frequency TEXT, -- daily, weekly, bi-weekly
  next_irrigation_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- active, paused, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add pest and disease alerts table
CREATE TABLE public.pest_disease_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- pest, disease, weed
  severity TEXT NOT NULL, -- low, medium, high, critical
  pest_disease_name TEXT NOT NULL,
  affected_area TEXT,
  symptoms TEXT,
  treatment_recommendations TEXT,
  image_url TEXT,
  detected_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add market prices table
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_type TEXT NOT NULL,
  region TEXT NOT NULL,
  price_per_kg DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  market_trend TEXT, -- rising, falling, stable
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add crop rotation plans table
CREATE TABLE public.crop_rotation_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  rotation_sequence JSONB NOT NULL, -- array of crops with seasons
  current_crop TEXT,
  next_crop TEXT,
  rotation_benefits TEXT,
  start_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add farm analytics table
CREATE TABLE public.farm_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- yield, soil_improvement, water_usage, carbon_sequestration
  metric_value DECIMAL(10, 2),
  measurement_unit TEXT,
  period_start DATE,
  period_end DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add carbon credits tracking table
CREATE TABLE public.carbon_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  carbon_sequestered_tons DECIMAL(10, 2),
  verification_status TEXT DEFAULT 'pending', -- pending, verified, credited
  verification_date DATE,
  credit_value DECIMAL(10, 2),
  certification_body TEXT,
  measurement_period_start DATE,
  measurement_period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add learning resources table
CREATE TABLE public.learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- soil_health, pest_management, irrigation, crop_rotation, climate_adaptation
  content_type TEXT NOT NULL, -- video, article, guide, tutorial
  content_url TEXT,
  thumbnail_url TEXT,
  difficulty_level TEXT, -- beginner, intermediate, advanced
  duration_minutes INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.crop_yield_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_disease_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_rotation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crop_yield_predictions
CREATE POLICY "Users can view predictions for their farms" ON public.crop_yield_predictions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = crop_yield_predictions.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert predictions for their farms" ON public.crop_yield_predictions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = crop_yield_predictions.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for irrigation_schedules
CREATE POLICY "Users can view irrigation schedules for their farms" ON public.irrigation_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = irrigation_schedules.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage irrigation schedules" ON public.irrigation_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = irrigation_schedules.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for pest_disease_alerts
CREATE POLICY "Users can view pest alerts for their farms" ON public.pest_disease_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = pest_disease_alerts.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage pest alerts" ON public.pest_disease_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = pest_disease_alerts.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for market_prices (public read)
CREATE POLICY "Anyone can view market prices" ON public.market_prices
  FOR SELECT USING (true);

-- RLS Policies for crop_rotation_plans
CREATE POLICY "Users can view rotation plans for their farms" ON public.crop_rotation_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = crop_rotation_plans.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage rotation plans" ON public.crop_rotation_plans
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = crop_rotation_plans.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for farm_analytics
CREATE POLICY "Users can view analytics for their farms" ON public.farm_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = farm_analytics.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analytics for their farms" ON public.farm_analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = farm_analytics.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for carbon_credits
CREATE POLICY "Users can view carbon credits for their farms" ON public.carbon_credits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = carbon_credits.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage carbon credits" ON public.carbon_credits
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = carbon_credits.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for learning_resources (public read)
CREATE POLICY "Anyone can view learning resources" ON public.learning_resources
  FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_irrigation_schedules_updated_at
  BEFORE UPDATE ON public.irrigation_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_rotation_plans_updated_at
  BEFORE UPDATE ON public.crop_rotation_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_crop_predictions_farm ON public.crop_yield_predictions(farm_id);
CREATE INDEX idx_irrigation_farm ON public.irrigation_schedules(farm_id);
CREATE INDEX idx_pest_alerts_farm ON public.pest_disease_alerts(farm_id);
CREATE INDEX idx_market_prices_crop ON public.market_prices(crop_type, recorded_date);
CREATE INDEX idx_rotation_plans_farm ON public.crop_rotation_plans(farm_id);
CREATE INDEX idx_analytics_farm ON public.farm_analytics(farm_id);
CREATE INDEX idx_carbon_credits_farm ON public.carbon_credits(farm_id);
CREATE INDEX idx_learning_category ON public.learning_resources(category);
