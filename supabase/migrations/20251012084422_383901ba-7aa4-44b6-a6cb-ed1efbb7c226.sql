-- Create crop_yield_predictions table
CREATE TABLE public.crop_yield_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  predicted_yield NUMERIC NOT NULL,
  confidence_score NUMERIC NOT NULL,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_yield_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view predictions for their farms"
ON public.crop_yield_predictions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = crop_yield_predictions.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can insert predictions for their farms"
ON public.crop_yield_predictions FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = crop_yield_predictions.farm_id
  AND farms.user_id = auth.uid()
));

-- Create irrigation_schedules table
CREATE TABLE public.irrigation_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  schedule_name TEXT NOT NULL,
  water_amount_liters NUMERIC NOT NULL,
  frequency TEXT NOT NULL,
  next_irrigation_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.irrigation_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view schedules for their farms"
ON public.irrigation_schedules FOR SELECT
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = irrigation_schedules.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can insert schedules for their farms"
ON public.irrigation_schedules FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = irrigation_schedules.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can update schedules for their farms"
ON public.irrigation_schedules FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = irrigation_schedules.farm_id
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can delete schedules for their farms"
ON public.irrigation_schedules FOR DELETE
USING (EXISTS (
  SELECT 1 FROM farms
  WHERE farms.id = irrigation_schedules.farm_id
  AND farms.user_id = auth.uid()
));

-- Create learning_resources table
CREATE TABLE public.learning_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_url TEXT NOT NULL,
  difficulty_level TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning resources"
ON public.learning_resources FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create resources"
ON public.learning_resources FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for updated_at on irrigation_schedules
CREATE TRIGGER update_irrigation_schedules_updated_at
BEFORE UPDATE ON public.irrigation_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on learning_resources
CREATE TRIGGER update_learning_resources_updated_at
BEFORE UPDATE ON public.learning_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();