
import { BiomarkerRow } from '../components/report/biomarkers/types';

export const mockBiomarkerDefinitions: BiomarkerRow[] = [
  { 
    id: '1', name: 'Glucose', unit: 'mg/dL', optimal_min: 70, optimal_max: 100, 
    description: 'Blood glucose level', category: ['Pérdida de Peso', 'Riesgo Cardíaco', 'Basic Metabolic'],
    conventional_min: 65, conventional_max: 110, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '2', name: 'Cholesterol', unit: 'mg/dL', optimal_min: 120, optimal_max: 200,
    description: 'Total cholesterol', category: ['Riesgo Cardíaco', 'Longevidad', 'Lipid'],
    conventional_min: 100, conventional_max: 240, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '3', name: 'Vitamin D', unit: 'ng/mL', optimal_min: 30, optimal_max: 60,
    description: 'Vitamin D 25-OH', category: ['vitalidad', 'Fuerza', 'Longevidad', 'Vitamins'],
    conventional_min: 20, conventional_max: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '4', name: 'Cortisol', unit: 'μg/dL', optimal_min: 6.2, optimal_max: 19.4,
    description: 'Morning cortisol', category: ['hormonas', 'vitalidad', 'Longevidad', 'Stress'],
    conventional_min: 4.0, conventional_max: 25.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '5', name: 'TSH', unit: 'μIU/mL', optimal_min: 0.4, optimal_max: 4.0,
    description: 'Thyroid stimulating hormone', category: ['hormonas', 'vitalidad', 'Thyroid'],
    conventional_min: 0.3, conventional_max: 5.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '6', name: 'CRP', unit: 'mg/L', optimal_min: 0, optimal_max: 3.0,
    description: 'C-reactive protein', category: ['Riesgo Cardíaco', 'Longevidad', 'Salud Cerebral', 'Inflammatory'],
    conventional_min: 0, conventional_max: 10.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '7', name: 'HbA1c', unit: '%', optimal_min: 4.0, optimal_max: 5.6,
    description: 'Hemoglobin A1c', category: ['Pérdida de Peso', 'Riesgo Cardíaco', 'Longevidad', 'Diabetes'],
    conventional_min: 4.0, conventional_max: 6.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '8', name: 'Testosterone', unit: 'ng/dL', optimal_min: 300, optimal_max: 1000,
    description: 'Total testosterone', category: ['hormonas', 'vitalidad', 'Salud Sexual', 'Fuerza', 'Male Hormones'],
    conventional_min: 200, conventional_max: 1200, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '9', name: 'Estradiol', unit: 'pg/mL', optimal_min: 30, optimal_max: 400,
    description: 'Estradiol hormone', category: ['hormonas', 'Salud Sexual', 'Female Hormones'],
    conventional_min: 15, conventional_max: 500, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '10', name: 'DHEA-S', unit: 'μg/dL', optimal_min: 85, optimal_max: 475,
    description: 'DHEA sulfate', category: ['hormonas', 'vitalidad', 'Adrenal'],
    conventional_min: 50, conventional_max: 600, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '11', name: 'FSH', unit: 'mIU/mL', optimal_min: 5, optimal_max: 20,
    description: 'Follicle stimulating hormone', category: ['hormonas', 'Female Hormones'],
    conventional_min: 1.4, conventional_max: 18.1, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '12', name: 'LH', unit: 'mIU/mL', optimal_min: 5, optimal_max: 25,
    description: 'Luteinizing hormone', category: ['hormonas', 'Female Hormones'],
    conventional_min: 1.9, conventional_max: 12.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '13', name: 'Progesterone', unit: 'ng/mL', optimal_min: 0.2, optimal_max: 25,
    description: 'Progesterone hormone', category: ['hormonas', 'Salud Sexual', 'Female Hormones'],
    conventional_min: 0.1, conventional_max: 30, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '14', name: 'Free T4', unit: 'ng/dL', optimal_min: 1.0, optimal_max: 1.8,
    description: 'Free thyroxine', category: ['hormonas', 'vitalidad', 'Thyroid'],
    conventional_min: 0.8, conventional_max: 2.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '15', name: 'Free T3', unit: 'pg/mL', optimal_min: 3.0, optimal_max: 4.5,
    description: 'Free triiodothyronine', category: ['hormonas', 'vitalidad', 'Thyroid'],
    conventional_min: 2.3, conventional_max: 5.0, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '16', name: 'Insulin', unit: 'μIU/mL', optimal_min: 2, optimal_max: 10,
    description: 'Fasting insulin', category: ['Pérdida de Peso', 'Riesgo Cardíaco', 'Diabetes'],
    conventional_min: 2, conventional_max: 25, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '17', name: 'Ferritin', unit: 'ng/mL', optimal_min: 30, optimal_max: 150,
    description: 'Iron storage protein', category: ['vitalidad', 'Iron Studies'],
    conventional_min: 12, conventional_max: 300, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '18', name: 'B12', unit: 'pg/mL', optimal_min: 400, optimal_max: 1000,
    description: 'Vitamin B12', category: ['vitalidad', 'Salud Cerebral', 'Vitamins'],
    conventional_min: 200, conventional_max: 900, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '19', name: 'Folate', unit: 'ng/mL', optimal_min: 4, optimal_max: 20,
    description: 'Folic acid', category: ['vitalidad', 'Salud Cerebral', 'Vitamins'],
    conventional_min: 3, conventional_max: 17, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '20', name: 'Magnesium', unit: 'mg/dL', optimal_min: 2.0, optimal_max: 2.6,
    description: 'Serum magnesium', category: ['vitalidad', 'Electrolytes'],
    conventional_min: 1.7, conventional_max: 2.2, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '21', name: 'HDL Cholesterol', unit: 'mg/dL', optimal_min: 60, optimal_max: 100,
    description: 'High density lipoprotein', category: ['Riesgo Cardíaco', 'Longevidad', 'Lipid'],
    conventional_min: 40, conventional_max: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '22', name: 'LDL Cholesterol', unit: 'mg/dL', optimal_min: 70, optimal_max: 100,
    description: 'Low density lipoprotein', category: ['Riesgo Cardíaco', 'Longevidad', 'Lipid'],
    conventional_min: 70, conventional_max: 160, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '23', name: 'Triglycerides', unit: 'mg/dL', optimal_min: 50, optimal_max: 100,
    description: 'Blood triglycerides', category: ['Riesgo Cardíaco', 'Pérdida de Peso', 'Lipid'],
    conventional_min: 50, conventional_max: 150, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '24', name: 'Homocysteine', unit: 'μmol/L', optimal_min: 5, optimal_max: 10,
    description: 'Cardiovascular risk marker', category: ['Riesgo Cardíaco', 'Salud Cerebral', 'Cardiac Risk'],
    conventional_min: 5, conventional_max: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  },
  { 
    id: '25', name: 'Iron', unit: 'μg/dL', optimal_min: 70, optimal_max: 150,
    description: 'Serum iron', category: ['vitalidad', 'Iron Studies'],
    conventional_min: 60, conventional_max: 170, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  }
];
