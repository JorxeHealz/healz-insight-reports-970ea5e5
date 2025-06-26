
-- Paso 1: Agregar una nueva columna temporal para las categorías como array
ALTER TABLE public.biomarkers 
ADD COLUMN categories_temp TEXT[];

-- Paso 2: Migrar datos existentes de category individual a categories_temp array
-- Mapear las categorías existentes a las nuevas categorías estándar
UPDATE public.biomarkers 
SET categories_temp = CASE 
  WHEN category ILIKE '%hormone%' OR category ILIKE '%hormonal%' OR category ILIKE '%testosterone%' OR category ILIKE '%estrogen%' THEN ARRAY['hormonas']
  WHEN category ILIKE '%heart%' OR category ILIKE '%cardio%' OR category ILIKE '%cardiovascular%' THEN ARRAY['Riesgo Cardíaco']  
  WHEN category ILIKE '%metabolic%' OR category ILIKE '%weight%' OR category ILIKE '%glucose%' THEN ARRAY['Pérdida de Peso']
  WHEN category ILIKE '%brain%' OR category ILIKE '%cognitive%' OR category ILIKE '%mental%' THEN ARRAY['Salud Cerebral']
  WHEN category ILIKE '%sexual%' OR category ILIKE '%reproductive%' THEN ARRAY['Salud Sexual']
  WHEN category ILIKE '%longevity%' OR category ILIKE '%aging%' OR category ILIKE '%anti-aging%' THEN ARRAY['Longevidad']
  WHEN category ILIKE '%strength%' OR category ILIKE '%muscle%' OR category ILIKE '%physical%' THEN ARRAY['Fuerza']
  WHEN category ILIKE '%vitality%' OR category ILIKE '%energy%' OR category ILIKE '%general%' THEN ARRAY['vitalidad']
  ELSE ARRAY['vitalidad'] -- Por defecto asignar a vitalidad
END;

-- Paso 3: Eliminar la columna antigua category
ALTER TABLE public.biomarkers 
DROP COLUMN category;

-- Paso 4: Renombrar la columna temporal a category
ALTER TABLE public.biomarkers 
RENAME COLUMN categories_temp TO category;

-- Paso 5: Establecer un valor por defecto para nuevos registros
ALTER TABLE public.biomarkers 
ALTER COLUMN category SET DEFAULT ARRAY['vitalidad'];

-- Paso 6: Hacer la columna NOT NULL
ALTER TABLE public.biomarkers 
ALTER COLUMN category SET NOT NULL;

-- Paso 7: Actualizar biomarcadores específicos que pueden pertenecer a múltiples categorías
-- Ejemplos de biomarcadores que típicamente pertenecen a múltiples categorías:

-- Testosterone: hormonas, vitalidad, salud sexual, fuerza
UPDATE public.biomarkers 
SET category = ARRAY['hormonas', 'vitalidad', 'Salud Sexual', 'Fuerza']
WHERE name ILIKE '%testosterone%';

-- Cortisol: hormonas, vitalidad, longevidad
UPDATE public.biomarkers 
SET category = ARRAY['hormonas', 'vitalidad', 'Longevidad']
WHERE name ILIKE '%cortisol%';

-- Cholesterol/LDL/HDL: riesgo cardíaco, longevidad
UPDATE public.biomarkers 
SET category = ARRAY['Riesgo Cardíaco', 'Longevidad']
WHERE name ILIKE '%cholesterol%' OR name ILIKE '%ldl%' OR name ILIKE '%hdl%';

-- Glucose/HbA1c: pérdida de peso, riesgo cardíaco, longevidad
UPDATE public.biomarkers 
SET category = ARRAY['Pérdida de Peso', 'Riesgo Cardíaco', 'Longevidad']
WHERE name ILIKE '%glucose%' OR name ILIKE '%hba1c%' OR name ILIKE '%insulin%';

-- Vitamin D: vitalidad, fuerza, longevidad
UPDATE public.biomarkers 
SET category = ARRAY['vitalidad', 'Fuerza', 'Longevidad']
WHERE name ILIKE '%vitamin d%';

-- CRP (inflamación): riesgo cardíaco, longevidad, salud cerebral
UPDATE public.biomarkers 
SET category = ARRAY['Riesgo Cardíaco', 'Longevidad', 'Salud Cerebral']
WHERE name ILIKE '%crp%' OR name ILIKE '%c-reactive%';
