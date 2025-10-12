-- Create market_prices table
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_type TEXT NOT NULL,
  region TEXT NOT NULL,
  price_per_kg NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  market_trend TEXT NOT NULL,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market prices"
ON public.market_prices FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert market prices"
ON public.market_prices FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create pest_disease_alerts table
CREATE TABLE IF NOT EXISTS public.pest_disease_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  pest_disease_name TEXT NOT NULL,
  affected_area TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  treatment_recommendations TEXT NOT NULL,
  detected_date DATE NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pest_disease_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts for their farms"
ON public.pest_disease_alerts FOR SELECT
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = pest_disease_alerts.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can insert alerts for their farms"
ON public.pest_disease_alerts FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = pest_disease_alerts.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can update alerts for their farms"
ON public.pest_disease_alerts FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = pest_disease_alerts.farm_id
  AND farms.user_id = auth.uid()
));