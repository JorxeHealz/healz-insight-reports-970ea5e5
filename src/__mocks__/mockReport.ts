
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
    optimal: 24,
    caution: 8,
    outOfRange: 3
  },
  topSymptoms: [
    { name: "Fatiga", severity: "high" },
    { name: "Dolor articular", severity: "med" },
    { name: "Insomnio", severity: "low" },
    { name: "Ansiedad", severity: "med" }
  ],
  recentBiomarkers: [
    { name: "Cortisol", valueWithUnit: "18.5 ng/mL", status: "caution", collectedAgo: "2 d" },
    { name: "Vitamina D", valueWithUnit: "28 ng/mL", status: "caution", collectedAgo: "2 d" },
    { name: "Glucosa", valueWithUnit: "95 mg/dL", status: "optimal", collectedAgo: "2 d" },
    { name: "TSH", valueWithUnit: "4.8 mU/L", status: "outOfRange", collectedAgo: "2 d" },
    { name: "Ferritina", valueWithUnit: "76 ng/mL", status: "optimal", collectedAgo: "2 d" }
  ]
};
