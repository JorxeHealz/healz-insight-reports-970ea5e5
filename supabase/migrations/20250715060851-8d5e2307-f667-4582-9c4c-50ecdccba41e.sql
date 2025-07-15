-- Eliminar duplicados de biomarcadores para el paciente específico Rubén Lechuga
-- Mantener solo el registro más reciente de cada biomarcador por analytics_id

WITH duplicate_biomarkers AS (
  SELECT 
    id,
    patient_id,
    biomarker_id,
    analytics_id,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY patient_id, biomarker_id, analytics_id 
      ORDER BY created_at DESC
    ) as row_num
  FROM patient_biomarkers
  WHERE patient_id = 'f73532de-eb33-44ab-ab01-6432fbc53a79'
    AND analytics_id = 'ade47cbd-32b8-4f86-a5be-77d18a5efb42'
),
duplicates_to_delete AS (
  SELECT id
  FROM duplicate_biomarkers
  WHERE row_num > 1
)
DELETE FROM patient_biomarkers
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Mostrar estadísticas después de la limpieza
SELECT 
  COUNT(*) as total_biomarkers_remaining,
  COUNT(DISTINCT biomarker_id) as unique_biomarkers
FROM patient_biomarkers
WHERE patient_id = 'f73532de-eb33-44ab-ab01-6432fbc53a79'
  AND analytics_id = 'ade47cbd-32b8-4f86-a5be-77d18a5efb42';