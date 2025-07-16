
export const panelDefinitions = {
  'Hormonas': {
    biomarkers: [
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
    ],
    description: 'Evaluación integral del sistema endocrino del paciente. Este panel permite identificar desequilibrios hormonales que pueden estar afectando múltiples sistemas corporales y la calidad de vida general.',
    symptoms: [
      'Energía baja',
      'Libido bajo',
      'Sueño deficiente',
      'Cambios de peso',
      'Pérdida de cabello',
      'Intolerancia al calor o frío',
      'Dificultad para concentrarse',
      'Niebla mental',
      'Cambios de humor',
      'Sofocos',
      'Empeoramiento del SPM',
      'Antojos de comida',
      'Ansiedad'
    ]
  },
  'Vitalidad': {
    biomarkers: [
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
    ],
    description: 'Marcadores clave para evaluar el estado de energía celular y vitalidad general del paciente. Útil para identificar deficiencias nutricionales y disfunciones metabólicas que impactan el bienestar general.',
    symptoms: [
      'Energía baja',
      'Resistencia disminuida',
      'Falta de motivación',
      'Niebla mental',
      'Enfermedades frecuentes',
      'Cambios de humor',
      'Sueño deficiente',
      'Rendimiento físico reducido'
    ]
  },
  'Riesgo Cardíaco': {
    biomarkers: [
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
    ],
    description: 'Panel esencial para la estratificación del riesgo cardiovascular. Permite identificar factores de riesgo modificables y planificar intervenciones preventivas tempranas antes de la manifestación clínica.',
    symptoms: [
      'Fatiga',
      'Dolor en el pecho',
      'Falta de aliento',
      'Hinchazón',
      'Mareos',
      'Aturdimiento',
      'Náuseas',
      'Sudoración',
      'Poca tolerancia al ejercicio',
      'Disfunción eréctil'
    ]
  },
  'Pérdida de Peso': {
    biomarkers: [
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
    ],
    description: 'Evaluación metabólica y hormonal para pacientes con objetivos de pérdida de peso. Identifica barreras metabólicas y permite personalizar estrategias terapéuticas basadas en el perfil individual del paciente.',
    symptoms: [
      'Exceso de grasa corporal',
      'Falta de aliento',
      'Sudoración excesiva',
      'Ronquidos',
      'Sueño deficiente',
      'Problemas de piel',
      'Rendimiento físico reducido',
      'Dolor articular',
      'Dolor de espalda',
      'Baja autoestima',
      'Presión arterial alta',
      'Disregulación de glucosa en sangre'
    ]
  },
  'Fuerza': {
    biomarkers: [
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
    ],
    description: 'Panel orientado a la evaluación de factores que influyen en la masa muscular, fuerza y rendimiento físico del paciente. Crucial para identificar deficiencias que limitan la capacidad funcional y la longevidad.',
    symptoms: [
      'Energía baja',
      'Rendimiento físico reducido',
      'Resistencia disminuida',
      'Falta de motivación',
      'Dolor articular',
      'Dolor de espalda',
      'Disregulación de glucosa en sangre',
      'Sueño deficiente',
      'Dolor prolongado',
      'Aumento de peso en la sección media'
    ]
  },
  'Salud Cerebral': {
    biomarkers: [
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
    ],
    description: 'Marcadores relacionados con la función cognitiva y neuroprotección. Permite identificar factores de riesgo para deterioro cognitivo y optimizar la salud neurológica a largo plazo del paciente.',
    symptoms: [
      'Pérdida de memoria',
      'Niebla mental',
      'Confusión',
      'Cambios de humor',
      'Dificultad para resolver problemas',
      'Problemas de lenguaje',
      'Coordinación deficiente',
      'Energía baja',
      'Cambios en el comportamiento',
      'Ansiedad'
    ]
  },
  'Salud Sexual': {
    biomarkers: [
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
    ],
    description: 'Evaluación específica de la función reproductiva y sexual del paciente. Esencial para identificar desequilibrios hormonales que afectan la fertilidad, libido y función sexual general.',
    symptoms: [
      'Libido bajo',
      'Disfunción eréctil',
      'Sequedad vaginal',
      'Dolor durante las relaciones',
      'Infertilidad',
      'Baja autoestima'
    ]
  },
  'Longevidad': {
    biomarkers: [
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
    ],
    description: 'Marcadores clave para la evaluación del envejecimiento biológico y la optimización de la longevidad saludable. Permite identificar procesos de envejecimiento acelerado y diseñar intervenciones anti-aging personalizadas.',
    symptoms: [
      'Fatiga crónica',
      'Energía baja',
      'Enfermedades frecuentes',
      'Dificultad para recuperarse',
      'Dolor persistente',
      'Sueño deficiente',
      'Actividad física disminuida',
      'Fragilidad',
      'Deterioro cognitivo',
      'Cambios de peso',
      'Cambios de humor'
    ]
  }
};
