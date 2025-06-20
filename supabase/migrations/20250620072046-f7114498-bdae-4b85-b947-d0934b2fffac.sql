
-- Actualizar la tabla biomarkers para reorganizar los paneles según objetivos de salud específicos
-- Los nuevos paneles están orientados a objetivos clínicos en lugar de sistemas corporales

-- 1. Panel de Hormonas (Hormones)
UPDATE public.biomarkers 
SET panel = ARRAY['Hormonas']
WHERE name IN (
  'Testosterona total',
  'Testosterona libre', 
  'SHBG',
  'DHEA-S',
  'Estradiol',
  'Progesterona',
  'IGF-1',
  'Hormona foliculoestimulante (FSH)',
  'Hormona luteinizante (LH)',
  'TSH',
  'Insulina',
  'Adiponectina'
);

-- 2. Panel de Vitalidad (Vitality)
UPDATE public.biomarkers 
SET panel = ARRAY['Vitalidad']
WHERE name IN (
  'Vitamina D (25-OH)',
  'TSH',
  'Testosterona libre',
  'Estradiol',
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'Colesterol HDL',
  'Apolipoproteína B (Apo B)',
  'Lipoproteína (a)',
  'Triglicéridos',
  'Hemoglobina glicosilada (HbA1c)',
  'Homocisteína',
  'Ferritina',
  'Ácido úrico'
);

-- 3. Panel de Riesgo Cardíaco (Cardiac Risk)
UPDATE public.biomarkers 
SET panel = ARRAY['Riesgo Cardíaco']
WHERE name IN (
  'Colesterol total',
  'LDL-C',
  'Colesterol HDL',
  'Triglicéridos',
  'Apolipoproteína B (Apo B)',
  'Lipoproteína (a)',
  'Glucosa en ayunas',
  'Hemoglobina glicosilada (HbA1c)',
  'Colesterol VLDL',
  'Homocisteína',
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'Ferritina',
  'Insulina'
);

-- 4. Panel de Pérdida de Peso (Weight Loss)
UPDATE public.biomarkers 
SET panel = ARRAY['Pérdida de Peso']
WHERE name IN (
  'Glucosa en ayunas',
  'Hemoglobina glicosilada (HbA1c)',
  'IGF-1',
  'Colesterol HDL',
  'Triglicéridos',
  'Apolipoproteína B (Apo B)',
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'TSH',
  'T4 libre',
  'Vitamina D (25-OH)',
  'Testosterona libre',
  'Testosterona total',
  'SHBG',
  'DHEA-S',
  'Estradiol',
  'Insulina',
  'Adiponectina'
);

-- 5. Panel de Fuerza (Strength)
UPDATE public.biomarkers 
SET panel = ARRAY['Fuerza']
WHERE name IN (
  'Glucosa en ayunas',
  'Hemoglobina glicosilada (HbA1c)',
  'IGF-1',
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'TSH',
  'T4 libre',
  'Vitamina D (25-OH)',
  'Testosterona libre',
  'Testosterona total',
  'SHBG',
  'DHEA-S',
  'Estradiol',
  'Plomo'
);

-- 6. Panel de Salud Cerebral (Brain Health)
UPDATE public.biomarkers 
SET panel = ARRAY['Salud Cerebral']
WHERE name IN (
  'Hemoglobina',
  'TSH',
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'Homocisteína',
  'Hemoglobina glicosilada (HbA1c)',
  'Glucosa en ayunas',
  'IGF-1',
  'Colesterol HDL',
  'Apolipoproteína B (Apo B)',
  'Vitamina D (25-OH)',
  'Testosterona libre',
  'Estradiol',
  'Insulina'
);

-- 7. Panel de Salud Sexual (Sexual Health)
UPDATE public.biomarkers 
SET panel = ARRAY['Salud Sexual']
WHERE name IN (
  'Testosterona total',
  'Testosterona libre',
  'Estradiol',
  'Progesterona',
  'Hormona luteinizante (LH)',
  'Hormona foliculoestimulante (FSH)',
  'SHBG',
  'DHEA-S',
  'TSH',
  'Vitamina D (25-OH)',
  'Hemoglobina',
  'Proteína C reactiva ultrasensible (hs-CRP)'
);

-- 8. Panel de Longevidad (Longevity)
UPDATE public.biomarkers 
SET panel = ARRAY['Longevidad']
WHERE name IN (
  'Proteína C reactiva ultrasensible (hs-CRP)',
  'IGF-1',
  'Hemoglobina glicosilada (HbA1c)',
  'Homocisteína',
  'Vitamina D (25-OH)',
  'TSH',
  'Testosterona libre',
  'Estradiol',
  'Colesterol HDL',
  'Triglicéridos',
  'Apolipoproteína B (Apo B)',
  'Lipoproteína (a)',
  'Ácido úrico',
  'Insulina',
  'Ferritina',
  'Adiponectina'
);

-- Actualizar categorías para que sean consistentes con los nuevos paneles
UPDATE public.biomarkers SET category = 'Hormonas' WHERE 'Hormonas' = ANY(panel);
UPDATE public.biomarkers SET category = 'Vitalidad' WHERE 'Vitalidad' = ANY(panel);
UPDATE public.biomarkers SET category = 'Riesgo Cardíaco' WHERE 'Riesgo Cardíaco' = ANY(panel);
UPDATE public.biomarkers SET category = 'Pérdida de Peso' WHERE 'Pérdida de Peso' = ANY(panel);
UPDATE public.biomarkers SET category = 'Fuerza' WHERE 'Fuerza' = ANY(panel);
UPDATE public.biomarkers SET category = 'Salud Cerebral' WHERE 'Salud Cerebral' = ANY(panel);
UPDATE public.biomarkers SET category = 'Salud Sexual' WHERE 'Salud Sexual' = ANY(panel);
UPDATE public.biomarkers SET category = 'Longevidad' WHERE 'Longevidad' = ANY(panel);
