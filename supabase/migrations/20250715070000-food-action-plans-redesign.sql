-- Rediseño completo de la tabla report_action_plans_foods para mejor organización
-- Optimizado para el contexto español y UX mejorada

-- 1. Añadir nuevos campos organizados por secciones lógicas
ALTER TABLE public.report_action_plans_foods
  -- SECCIÓN: Información básica del plan
  ADD COLUMN plan_title TEXT DEFAULT 'Plan Alimentario',
  ADD COLUMN plan_description TEXT,
  ADD COLUMN implementation_timeline TEXT, -- "inmediato", "gradual", "por fases"
  
  -- SECCIÓN: Objetivos principales (siempre visibles)
  ADD COLUMN main_objectives JSONB DEFAULT '[]'::jsonb, -- Array de objetivos principales
  ADD COLUMN primary_focus TEXT, -- "pérdida de peso", "antiinflamatorio", "energía", etc.
  ADD COLUMN expected_outcomes JSONB DEFAULT '[]'::jsonb, -- Resultados esperados
  
  -- SECCIÓN: Alimentos específicos (mejor organización)
  ADD COLUMN recommended_foods JSONB DEFAULT '[]'::jsonb, -- Alimentos a incluir
  ADD COLUMN foods_to_eliminate JSONB DEFAULT '[]'::jsonb, -- Alimentos a evitar completamente
  ADD COLUMN foods_to_moderate JSONB DEFAULT '[]'::jsonb, -- Alimentos a consumir con moderación
  
  -- SECCIÓN: Ejemplos de comidas españolas
  ADD COLUMN spanish_meal_examples JSONB DEFAULT '{}'::jsonb, -- Comidas adaptadas a España
  ADD COLUMN meal_timing_preferences TEXT, -- Horarios de comida españoles
  ADD COLUMN portion_size_guide TEXT, -- Guía de porciones
  
  -- SECCIÓN: Consideraciones especiales
  ADD COLUMN special_instructions JSONB DEFAULT '[]'::jsonb, -- Instrucciones especiales
  ADD COLUMN contraindications JSONB DEFAULT '[]'::jsonb, -- Contraindicaciones
  ADD COLUMN adaptation_notes TEXT, -- Notas de adaptación personal
  
  -- SECCIÓN: Hidratación y complementos
  ADD COLUMN hydration_goals TEXT, -- Objetivos de hidratación específicos
  ADD COLUMN hydration_schedule TEXT, -- Horarios de hidratación
  ADD COLUMN cooking_methods JSONB DEFAULT '[]'::jsonb, -- Métodos de cocción recomendados
  
  -- SECCIÓN: Seguimiento y progresión
  ADD COLUMN progress_indicators JSONB DEFAULT '[]'::jsonb, -- Indicadores de progreso
  ADD COLUMN adjustment_criteria TEXT, -- Criterios para ajustar el plan
  ADD COLUMN review_schedule TEXT; -- Cronograma de revisión

-- 2. Crear índices para mejorar rendimiento en las nuevas consultas
CREATE INDEX IF NOT EXISTS idx_food_plans_primary_focus 
  ON public.report_action_plans_foods(primary_focus);
  
CREATE INDEX IF NOT EXISTS idx_food_plans_implementation_timeline 
  ON public.report_action_plans_foods(implementation_timeline);

-- 3. Añadir comentarios para documentar el nuevo esquema
COMMENT ON COLUMN public.report_action_plans_foods.main_objectives IS 
  'Objetivos principales del plan alimentario - siempre visibles en preview';
  
COMMENT ON COLUMN public.report_action_plans_foods.spanish_meal_examples IS 
  'Ejemplos de comidas adaptados al contexto español: {"desayuno": "...", "almuerzo": "...", "merienda": "...", "cena": "..."}';
  
COMMENT ON COLUMN public.report_action_plans_foods.recommended_foods IS 
  'Array de alimentos específicos recomendados para incluir en la dieta';
  
COMMENT ON COLUMN public.report_action_plans_foods.foods_to_eliminate IS 
  'Array de alimentos que se deben evitar completamente';
  
COMMENT ON COLUMN public.report_action_plans_foods.foods_to_moderate IS 
  'Array de alimentos que se pueden consumir con moderación o limitaciones';

-- 4. Migrar datos existentes a la nueva estructura (si existen)
UPDATE public.report_action_plans_foods 
SET 
  main_objectives = COALESCE(main_goals, '[]'::jsonb),
  recommended_foods = COALESCE(foods_to_include, '[]'::jsonb),
  foods_to_eliminate = COALESCE(foods_to_avoid, '[]'::jsonb),
  spanish_meal_examples = COALESCE(meal_examples, '{}'::jsonb),
  special_instructions = COALESCE(special_considerations, '[]'::jsonb),
  hydration_goals = hydration_recommendation,
  portion_size_guide = portion_guidelines,
  adaptation_notes = preparation_notes
WHERE id IS NOT NULL;

-- 5. Crear función auxiliar para validar estructura de datos
CREATE OR REPLACE FUNCTION validate_food_plan_structure()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que main_objectives sea un array
  IF NEW.main_objectives IS NOT NULL AND jsonb_typeof(NEW.main_objectives) != 'array' THEN
    RAISE EXCEPTION 'main_objectives debe ser un array JSON';
  END IF;
  
  -- Validar que spanish_meal_examples tenga estructura correcta
  IF NEW.spanish_meal_examples IS NOT NULL AND jsonb_typeof(NEW.spanish_meal_examples) != 'object' THEN
    RAISE EXCEPTION 'spanish_meal_examples debe ser un objeto JSON';
  END IF;
  
  -- Validar campos de alimentos como arrays
  IF NEW.recommended_foods IS NOT NULL AND jsonb_typeof(NEW.recommended_foods) != 'array' THEN
    RAISE EXCEPTION 'recommended_foods debe ser un array JSON';
  END IF;
  
  IF NEW.foods_to_eliminate IS NOT NULL AND jsonb_typeof(NEW.foods_to_eliminate) != 'array' THEN
    RAISE EXCEPTION 'foods_to_eliminate debe ser un array JSON';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear trigger para validación automática
CREATE TRIGGER validate_food_plan_structure_trigger
  BEFORE INSERT OR UPDATE ON public.report_action_plans_foods
  FOR EACH ROW EXECUTE FUNCTION validate_food_plan_structure();

-- 7. Crear vista materializada para consultas optimizadas
CREATE MATERIALIZED VIEW food_plans_summary AS
SELECT 
  id,
  report_id,
  form_id,
  patient_id,
  plan_title,
  primary_focus,
  main_objectives,
  jsonb_array_length(COALESCE(recommended_foods, '[]'::jsonb)) as recommended_count,
  jsonb_array_length(COALESCE(foods_to_eliminate, '[]'::jsonb)) as eliminate_count,
  implementation_timeline,
  priority,
  created_at
FROM public.report_action_plans_foods
WHERE active = true;

-- 8. Crear índice en la vista materializada
CREATE INDEX idx_food_plans_summary_report_id ON food_plans_summary(report_id);
CREATE INDEX idx_food_plans_summary_priority ON food_plans_summary(priority, primary_focus);

-- 9. Función para refrescar la vista materializada
CREATE OR REPLACE FUNCTION refresh_food_plans_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY food_plans_summary;
END;
$$ LANGUAGE plpgsql;

-- 10. Añadir políticas RLS específicas para el nuevo esquema
DROP POLICY IF EXISTS "Allow all operations on report_action_plans_foods" ON public.report_action_plans_foods;

CREATE POLICY "Allow read access to food plans" ON public.report_action_plans_foods
  FOR SELECT USING (true);

CREATE POLICY "Allow insert food plans" ON public.report_action_plans_foods
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update food plans" ON public.report_action_plans_foods
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete food plans" ON public.report_action_plans_foods
  FOR DELETE USING (true); 