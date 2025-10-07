-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  size_hectares DECIMAL(10, 2),
  soil_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create soil_health_reports table
CREATE TABLE public.soil_health_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  ph_level DECIMAL(3, 1),
  nitrogen_level DECIMAL(5, 2),
  phosphorus_level DECIMAL(5, 2),
  potassium_level DECIMAL(5, 2),
  organic_matter DECIMAL(5, 2),
  moisture_content DECIMAL(5, 2),
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create climate_alerts table
CREATE TABLE public.climate_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- drought, flood, frost, heatwave
  severity TEXT NOT NULL, -- low, medium, high
  description TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Create community_posts table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- tip, question, success-story
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for additional user info
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  farm_location TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for farms
CREATE POLICY "Users can view their own farms" ON public.farms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms" ON public.farms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms" ON public.farms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms" ON public.farms
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for soil_health_reports
CREATE POLICY "Users can view reports for their farms" ON public.soil_health_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = soil_health_reports.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reports for their farms" ON public.soil_health_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = soil_health_reports.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for climate_alerts
CREATE POLICY "Users can view alerts for their farms" ON public.climate_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = climate_alerts.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their alerts" ON public.climate_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.farms 
      WHERE farms.id = climate_alerts.farm_id 
      AND farms.user_id = auth.uid()
    )
  );

-- RLS Policies for community_posts (public read, authenticated write)
CREATE POLICY "Anyone can view community posts" ON public.community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();