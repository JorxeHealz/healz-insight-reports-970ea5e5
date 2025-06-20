
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
    description: 'Las hormonas son los mensajeros de tu cuerpo, transportando señales a través de la sangre para activar órganos, piel, músculos y otros tejidos.',
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
      'Antojos de comida'
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
    description: 'La sensación de vitalidad refleja qué tan bien está funcionando tu cuerpo en general, hasta el nivel celular. A medida que la energía celular disminuye con la edad, también lo hace la vitalidad.',
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
    description: 'La mejor manera de vivir mucho tiempo es no morir prematuramente. El infarto y el accidente cerebrovascular son causas principales de muerte prematura y los biomarcadores asociados pueden medirse y manejarse décadas antes.',
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
    description: 'La grasa corporal es posiblemente el factor más importante para la longevidad. Mantener un peso saludable mejora el bienestar psicológico y reduce el riesgo de enfermedades crónicas.',
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
    description: 'Construir y mantener la fuerza no solo es crítico para sentirse bien y hacer las actividades que amas. También es uno de los factores más importantes en la esperanza de vida.',
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
    description: 'Las disminuciones en el rendimiento mental como pérdida de memoria, niebla mental y procesamiento más lento pueden mitigarse. Varios biomarcadores juegan un papel clave en mantener la función cerebral óptima.',
    symptoms: [
      'Pérdida de memoria',
      'Niebla mental',
      'Confusión',
      'Cambios de humor',
      'Dificultad para resolver problemas',
      'Problemas de lenguaje',
      'Coordinación deficiente',
      'Energía baja',
      'Cambios en el comportamiento'
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
    description: 'La salud sexual ha demostrado reducir el estrés, mejorar la longevidad y calidad de vida, e incluso ayudar a prevenir enfermedades cardíacas.',
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
    description: 'El envejecimiento es un fenómeno complejo impulsado por varios procesos subyacentes en nuestro cuerpo. Al abordar proactivamente estos factores, es posible cambiar la trayectoria de cómo envejeces.',
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
