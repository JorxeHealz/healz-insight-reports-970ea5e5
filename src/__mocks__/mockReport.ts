export const mockReportData = {
  vitalityScore: 76,
  qualityOfLife: 4,
  risks: {
    cardio: 35,
    mental: 15,
    adrenal: 45,
    oncologic: 12,
    metabolic: 28,
    inflammatory: 52
  },
  biologicalAge: 42,
  chronologicalAge: 48,
  // Updated biomarker summaries for each demo patient
  biomarkerSummary: {
    // Default summary for mock data
    optimal: 12,
    caution: 3,
    outOfRange: 8
  },
  topSymptoms: [
    { name: "Fatiga", severity: "high" },
    { name: "Dolor articular", severity: "med" },
    { name: "Insomnio", severity: "low" },
    { name: "Ansiedad", severity: "med" }
  ],
  recentBiomarkers: [
    // Salud Cardiovascular
    { name: "Colesterol total", valueWithUnit: "195 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "LDL-C", valueWithUnit: "115 mg/dL", status: "caution", collectedAgo: "2 d" },
    { name: "Colesterol HDL", valueWithUnit: "58 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Triglicéridos", valueWithUnit: "142 mg/dL", status: "caution", collectedAgo: "2 d" },
    { name: "hs-CRP", valueWithUnit: "2.8 mg/L", status: "caution", collectedAgo: "2 d" },
    { name: "Homocisteína", valueWithUnit: "12.5 μmol/L", status: "optimal", collectedAgo: "2 d" },
    
    // Metabolismo
    { name: "Glucosa en ayunas", valueWithUnit: "95 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Hemoglobina A1c", valueWithUnit: "5.4%", status: "optimal", collectedAgo: "2 d" },
    { name: "Insulina", valueWithUnit: "8.2 μU/mL", status: "caution", collectedAgo: "2 d" },
    { name: "ALT", valueWithUnit: "28 U/L", status: "optimal", collectedAgo: "2 d" },
    { name: "AST", valueWithUnit: "24 U/L", status: "optimal", collectedAgo: "2 d" },
    
    // Función Tiroidea
    { name: "TSH", valueWithUnit: "4.8 mU/L", status: "outOfRange", collectedAgo: "2 d" },
    { name: "T4 libre", valueWithUnit: "1.2 ng/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "T3 libre", valueWithUnit: "3.1 pg/mL", status: "optimal", collectedAgo: "2 d" },
    
    // Hormonas (ejemplo masculinas)
    { name: "Testosterona total", valueWithUnit: "520 ng/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "SHBG", valueWithUnit: "32 nmol/L", status: "optimal", collectedAgo: "2 d" },
    { name: "PSA total", valueWithUnit: "1.1 ng/mL", status: "optimal", collectedAgo: "2 d" },
    
    // Hígado
    { name: "ALP", valueWithUnit: "78 U/L", status: "optimal", collectedAgo: "2 d" },
    { name: "GGT", valueWithUnit: "45 U/L", status: "caution", collectedAgo: "2 d" },
    { name: "Bilirrubina total", valueWithUnit: "0.8 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Albúmina", valueWithUnit: "4.2 g/dL", status: "optimal", collectedAgo: "2 d" },
    
    // Riñón y Electrolitos
    { name: "Creatinina", valueWithUnit: "1.0 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "BUN", valueWithUnit: "18 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "eGFR", valueWithUnit: "95 mL/min", status: "optimal", collectedAgo: "2 d" }
  ],
  
  // Notas clínicas con historial
  clinicalNotes: [
    {
      id: "1",
      date: "15 Dic 2024",
      title: "Evaluación Inicial Completa",
      author: "Dr. María González",
      type: "Evaluación inicial",
      summary: "Primera evaluación completa del paciente. Se observan patrones interesantes en los biomarcadores que sugieren oportunidades de optimización en varias áreas de salud.",
      findings: [
        {
          category: "Salud Metabólica y Cardiovascular",
          priority: "medium",
          findings: "Los niveles de colesterol total están dentro del rango normal, pero el LDL-C muestra valores en el límite superior. Los triglicéridos están ligeramente elevados, lo que junto con la insulina en precaución sugiere resistencia a la insulina temprana.",
          recommendations: [
            "Implementar ayuno intermitente 16:8",
            "Reducir carbohidratos refinados en un 40%",
            "Aumentar omega-3 a través de pescado graso 3x/semana"
          ]
        },
        {
          category: "Función Tiroidea",
          priority: "high",
          findings: "TSH elevado (4.8 mU/L) indica hipotiroidismo subclínico. Aunque T3 y T4 libres están normales, este patrón puede explicar la fatiga reportada y afectar el metabolismo.",
          recommendations: [
            "Repetir panel tiroideo en 6 semanas",
            "Evaluar anticuerpos tiroideos si persiste",
            "Optimizar niveles de selenio y yodo"
          ]
        },
        {
          category: "Estrés y Recuperación",
          priority: "medium",
          findings: "Cortisol ligeramente elevado sugiere estrés crónico. Combinado con los síntomas de insomnio reportados, indica desregulación del eje HPA.",
          recommendations: [
            "Implementar técnicas de manejo del estrés",
            "Mejorar higiene del sueño",
            "Considerar adaptógenos naturales"
          ]
        }
      ]
    },
    {
      id: "2",
      date: "28 Nov 2024",
      title: "Seguimiento Nutricional",
      author: "Lic. Ana Rodríguez",
      type: "Seguimiento",
      summary: "Revisión de progreso después de 4 semanas de implementación del plan nutricional. Se observan mejoras modestas en varios marcadores.",
      findings: [
        {
          category: "Nutrientes Esenciales",
          priority: "low",
          findings: "Vitamina D sigue en rango de precaución (28 ng/mL). Zinc también muestra niveles subóptimos que pueden afectar la función inmune y la cicatrización.",
          recommendations: [
            "Continuar suplementación con vitamina D3 2000 UI",
            "Agregar zinc quelado 15mg diarios",
            "Incrementar exposición solar controlada"
          ]
        }
      ]
    },
    {
      id: "3",
      date: "10 Nov 2024",
      title: "Análisis de Laboratorio",
      author: "Dr. María González",
      type: "Resultados",
      summary: "Resultados del panel completo de biomarcadores. Se establece línea base para monitoreo futuro.",
      findings: [
        {
          category: "General",
          priority: "low",
          findings: "Panel general muestra buen estado de salud con áreas específicas de oportunidad identificadas. La mayoría de biomarcadores están en rangos óptimos.",
          recommendations: [
            "Mantener hábitos saludables actuales",
            "Implementar plan de optimización específico",
            "Seguimiento en 3 meses"
          ]
        }
      ]
    }
  ],

  // Plan de acción personalizado
  actionPlan: {
    foods: [
      {
        title: "Aumentar Omega-3",
        description: "Incorporar pescado graso (salmón, sardinas, caballa) para mejorar perfil lipídico y reducir inflamación",
        priority: "high",
        duration: "Permanente"
      },
      {
        title: "Reducir Carbohidratos Refinados",
        description: "Eliminar azúcares añadidos y harinas refinadas para mejorar sensibilidad a la insulina",
        priority: "high",
        duration: "3 meses mínimo"
      },
      {
        title: "Ayuno Intermitente",
        description: "Implementar ventana de alimentación de 8 horas (12:00-20:00) para optimizar metabolismo",
        priority: "medium",
        duration: "4 semanas de adaptación"
      },
      {
        title: "Alimentos Ricos en Selenio",
        description: "Nueces de Brasil, atún, huevos para soporte tiroideo",
        priority: "medium",
        duration: "Permanente"
      }
    ],
    supplements: [
      {
        title: "Vitamina D3",
        description: "Para corregir deficiencia y optimizar función inmune",
        dosage: "2000 UI diarios",
        duration: "3 meses, luego reevaluar",
        priority: "high"
      },
      {
        title: "Zinc Quelado",
        description: "Optimizar niveles para función inmune y cicatrización",
        dosage: "15mg diarios con comida",
        duration: "2 meses",
        priority: "medium"
      },
      {
        title: "Magnesio Glicinato",
        description: "Soporte para relajación y calidad del sueño",
        dosage: "200mg antes de dormir",
        duration: "Permanente",
        priority: "medium"
      },
      {
        title: "Omega-3 EPA/DHA",
        description: "Complementar ingesta de pescado para antiinflamatorio",
        dosage: "1000mg EPA + 500mg DHA",
        duration: "6 meses mínimo",
        priority: "high"
      }
    ],
    lifestyle: [
      {
        title: "Ejercicio de Resistencia",
        description: "Entrenamiento con pesas 3x/semana para mejorar composición corporal y sensibilidad a insulina",
        priority: "high",
        duration: "Permanente"
      },
      {
        title: "Manejo del Estrés",
        description: "Meditación diaria 10-15 minutos o técnicas de respiración para reducir cortisol",
        priority: "high",
        duration: "Establecer hábito"
      },
      {
        title: "Higiene del Sueño",
        description: "Dormir 7-8 horas, sin pantallas 1h antes de acostarse, temperatura fresca",
        priority: "medium",
        duration: "Permanente"
      },
      {
        title: "Exposición Solar",
        description: "15-20 minutos de sol directo diarios para síntesis natural de vitamina D",
        priority: "low",
        duration: "Permanente"
      }
    ],
    followup: [
      {
        title: "Análisis de Seguimiento",
        description: "Panel básico: TSH, vitamina D, perfil lipídico, glucosa",
        priority: "high",
        duration: "En 6 semanas"
      },
      {
        title: "Evaluación Nutricional",
        description: "Revisión con nutricionista para ajustar plan alimentario",
        priority: "medium",
        duration: "En 4 semanas"
      },
      {
        title: "Panel Completo",
        description: "Reevaluación completa de todos los biomarcadores",
        priority: "medium",
        duration: "En 3 meses"
      }
    ]
  }
};
