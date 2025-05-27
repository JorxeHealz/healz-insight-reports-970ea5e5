
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
  biomarkerSummary: {
    optimal: 42,
    caution: 18,
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
    { name: "eGFR", valueWithUnit: "95 mL/min", status: "optimal", collectedAgo: "2 d" },
    { name: "Sodio", valueWithUnit: "140 mEq/L", status: "optimal", collectedAgo: "2 d" },
    { name: "Potasio", valueWithUnit: "4.2 mEq/L", status: "optimal", collectedAgo: "2 d" },
    
    // Hematología
    { name: "Hemoglobina", valueWithUnit: "15.2 g/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Hematocrito", valueWithUnit: "45.8%", status: "optimal", collectedAgo: "2 d" },
    { name: "RBC", valueWithUnit: "4.8 M/μL", status: "optimal", collectedAgo: "2 d" },
    { name: "Plaquetas", valueWithUnit: "285 K/μL", status: "optimal", collectedAgo: "2 d" },
    { name: "MCV", valueWithUnit: "88 fL", status: "optimal", collectedAgo: "2 d" },
    
    // Nutrientes Esenciales
    { name: "Ferritina", valueWithUnit: "76 ng/mL", status: "optimal", collectedAgo: "2 d" },
    { name: "Vitamina D", valueWithUnit: "28 ng/mL", status: "caution", collectedAgo: "2 d" },
    { name: "Hierro", valueWithUnit: "95 μg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Magnesio", valueWithUnit: "2.1 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "Zinc", valueWithUnit: "88 μg/dL", status: "caution", collectedAgo: "2 d" },
    
    // Estrés y Edad Biológica
    { name: "Cortisol", valueWithUnit: "18.5 ng/mL", status: "caution", collectedAgo: "2 d" },
    { name: "DHEA-S", valueWithUnit: "185 μg/dL", status: "optimal", collectedAgo: "2 d" },
    
    // Inflamación e Inmunidad
    { name: "Leucocitos", valueWithUnit: "6.8 K/μL", status: "optimal", collectedAgo: "2 d" },
    { name: "Neutrófilos", valueWithUnit: "65%", status: "optimal", collectedAgo: "2 d" },
    { name: "Linfocitos", valueWithUnit: "28%", status: "optimal", collectedAgo: "2 d" },
    
    // Urianálisis
    { name: "Proteína urinaria", valueWithUnit: "Negativo", status: "optimal", collectedAgo: "2 d" },
    { name: "Glucosa urinaria", valueWithUnit: "Negativo", status: "optimal", collectedAgo: "2 d" },
    { name: "pH urinario", valueWithUnit: "6.2", status: "optimal", collectedAgo: "2 d" },
    
    // Metales Pesados
    { name: "Plomo", valueWithUnit: "2.1 μg/dL", status: "caution", collectedAgo: "2 d" },
    { name: "Mercurio", valueWithUnit: "1.8 μg/L", status: "optimal", collectedAgo: "2 d" }
  ]
};
