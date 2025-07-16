-- Traducir opciones de frecuencia (Never, Rarely, Sometimes, Frequently, Always)
UPDATE form_questions 
SET options = '["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]'::jsonb
WHERE options = '["Never", "Rarely", "Sometimes", "Frequently", "Always"]'::jsonb;

-- Traducir opciones de Sí/No
UPDATE form_questions 
SET options = '["Sí", "No"]'::jsonb
WHERE options = '["Yes", "No"]'::jsonb;

-- Traducir opciones de sexo asignado al nacer
UPDATE form_questions 
SET options = '["Masculino", "Femenino", "Intersexual"]'::jsonb
WHERE options = '["Male", "Female", "Intersex"]'::jsonb;

-- Traducir objetivos de salud
UPDATE form_questions 
SET options = '["Perder peso", "Ganar músculo", "Mejorar energía", "Mejorar sueño", "Reducir estrés", "Mejorar digestión", "Equilibrar hormonas", "Prevenir enfermedades", "Mejorar rendimiento deportivo", "Aumentar longevidad"]'::jsonb
WHERE options = '["Lose weight", "Gain muscle", "Improve energy", "Improve sleep", "Reduce stress", "Improve digestion", "Balance hormones", "Prevent disease", "Improve athletic performance", "Increase longevity"]'::jsonb;

-- Traducir tipos de dieta
UPDATE form_questions 
SET options = '["Omnívora", "Vegetariana", "Vegana", "Cetogénica", "Paleo", "Mediterránea", "Sin gluten", "Baja en carbohidratos", "Intermitente", "Otra"]'::jsonb
WHERE options = '["Omnivore", "Vegetarian", "Vegan", "Ketogenic", "Paleo", "Mediterranean", "Gluten-free", "Low-carb", "Intermittent fasting", "Other"]'::jsonb;

-- Traducir tipos de ejercicio
UPDATE form_questions 
SET options = '["Caminar", "Correr", "Ciclismo", "Natación", "Entrenamiento con pesas", "Yoga", "Pilates", "Deportes de equipo", "Artes marciales", "Baile", "No hago ejercicio"]'::jsonb
WHERE options = '["Walking", "Running", "Cycling", "Swimming", "Weight training", "Yoga", "Pilates", "Team sports", "Martial arts", "Dancing", "No exercise"]'::jsonb;

-- Traducir patrones de sueño (Always, Most of the time, Sometimes, Rarely, Never)
UPDATE form_questions 
SET options = '["Siempre", "La mayoría del tiempo", "A veces", "Raramente", "Nunca"]'::jsonb
WHERE options = '["Always", "Most of the time", "Sometimes", "Rarely", "Never"]'::jsonb;

-- Traducir fuentes de estrés
UPDATE form_questions 
SET options = '["Trabajo", "Familia", "Finanzas", "Salud", "Relaciones", "Estudios", "Otro"]'::jsonb
WHERE options = '["Work", "Family", "Finances", "Health", "Relationships", "Studies", "Other"]'::jsonb;

-- Traducir métodos de gestión del estrés
UPDATE form_questions 
SET options = '["Ejercicio", "Meditación", "Respiración profunda", "Yoga", "Tiempo en la naturaleza", "Hobbies", "Tiempo con amigos/familia", "Terapia", "Música", "Lectura", "No gestiono el estrés"]'::jsonb
WHERE options = '["Exercise", "Meditation", "Deep breathing", "Yoga", "Time in nature", "Hobbies", "Time with friends/family", "Therapy", "Music", "Reading", "I don''t manage stress"]'::jsonb;

-- Traducir exposición a tóxicos
UPDATE form_questions 
SET options = '["No", "Ocasionalmente", "En el trabajo", "En casa", "Ambos"]'::jsonb
WHERE options = '["No", "Occasionally", "At work", "At home", "Both"]'::jsonb;