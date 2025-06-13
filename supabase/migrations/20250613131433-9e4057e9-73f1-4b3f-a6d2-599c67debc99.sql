
-- Modificar la tabla biomarkers para que panel sea un array
ALTER TABLE public.biomarkers 
ALTER COLUMN panel TYPE text[] USING CASE 
  WHEN panel IS NULL THEN NULL 
  ELSE ARRAY[panel] 
END;

-- Actualizar biomarcadores que deben estar en múltiples paneles
-- Testosterona total y libre en ambos paneles hormonales
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas Femeninas', 'Hormonas Masculinas']
WHERE name IN ('Testosterona total', 'Testosterona libre');

-- DHEA-S también en ambos paneles hormonales
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas Femeninas', 'Hormonas Masculinas', 'Estrés y Envejecimiento']
WHERE name = 'DHEA-S';

-- LH y FSH en ambos paneles hormonales
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas Femeninas', 'Hormonas Masculinas']
WHERE name IN ('Hormona luteinizante (LH)', 'Hormona foliculoestimulante (FSH)');

-- Prolactina en ambos paneles hormonales
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas Femeninas', 'Hormonas Masculinas']
WHERE name = 'Prolactina';

-- Estradiol puede aparecer en hormonas masculinas también (para control)
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas Femeninas', 'Hormonas Masculinas']
WHERE name = 'Estradiol';

-- Cortisol puede estar en estrés y hormonas
UPDATE public.biomarkers 
SET panel = ARRAY['Estrés y Envejecimiento']
WHERE name LIKE '%ortisol%';

-- TSH puede estar en función tiroidea y vitalidad
UPDATE public.biomarkers 
SET panel = ARRAY['Función Tiroidea']
WHERE name = 'TSH';
