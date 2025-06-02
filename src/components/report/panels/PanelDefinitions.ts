
export const panelDefinitions = {
  'Salud Cardiovascular': {
    biomarkers: [
      'Apolipoproteína B (Apo B)',
      'Colesterol total',
      'Colesterol HDL',
      'Relación Colesterol/HDL',
      'Colesterol no-HDL',
      'LDL-C',
      'Número de partículas LDL',
      'HDL large',
      'Triglicéridos',
      'Lipoproteína (a)',
      'Proteína C reactiva ultrasensible (hs-CRP)',
      'Homocisteína'
    ],
    description: 'Vigilar tu perfil lipídico, inflamación vascular y riesgo de aterosclerosis antes de que aparezcan síntomas.'
  },
  'Metabolismo y Resistencia a la Insulina': {
    biomarkers: [
      'Glucosa en ayunas',
      'Hemoglobina glicosilada (HbA1c)',
      'Insulina en ayunas',
      'HOMA-IR',
      'Péptido C',
      'Fructosamina'
    ],
    description: 'Detectar disglucemias, síndrome metabólico y señales tempranas de diabetes para ajustar dieta y ejercicio.'
  },
  'Hormonas Femeninas': {
    biomarkers: [
      'Estradiol',
      'Progesterona',
      'Hormona luteinizante (LH)',
      'Hormona foliculoestimulante (FSH)',
      'Testosterona total',
      'Testosterona libre',
      'SHBG',
      'DHEA-S',
      'Prolactina',
      'Hormona antimülleriana (AMH)'
    ],
    description: 'Optimizar fertilidad, regular el ciclo y mantener energía y estado de ánimo mediante el equilibrio endocrino.'
  },
  'Hormonas Masculinas': {
    biomarkers: [
      'Testosterona total',
      'Testosterona libre',
      'SHBG',
      'DHEA-S',
      'Estradiol',
      'Prolactina',
      'Hormona luteinizante (LH)',
      'Hormona foliculoestimulante (FSH)',
      'PSA total',
      'PSA libre'
    ],
    description: 'Potenciar masa muscular, líbido y salud prostática asegurando niveles hormonales óptimos y estables.'
  },
  'Función Tiroidea': {
    biomarkers: [
      'TSH',
      'T4 libre',
      'T3 libre',
      'T3 reversa',
      'Anticuerpos anti-TPO',
      'Anticuerpos anti-tiroglobulina',
      'Tiroglobulina'
    ],
    description: 'Controlar el termostato metabólico del cuerpo, clave en peso, temperatura, concentración y vitalidad.'
  },
  'Inflamación e Inmunidad': {
    biomarkers: [
      'Proteína C reactiva ultrasensible (hs-CRP)',
      'Velocidad de sedimentación globular (VSG)',
      'Interleucina-6 (IL-6)',
      'Factor de necrosis tumoral alfa (TNF-α)',
      'Inmunoglobulina A (IgA)',
      'Inmunoglobulina G (IgG)',
      'Inmunoglobulina M (IgM)',
      'Complemento C3',
      'Complemento C4'
    ],
    description: 'Identificar inflamación crónica silenciosa y la capacidad del sistema inmune para prevenir enfermedades.'
  },
  'Función Hepática': {
    biomarkers: [
      'ALT (Alanina aminotransferasa)',
      'AST (Aspartato aminotransferasa)',
      'Fosfatasa alcalina',
      'Gamma-glutamil transferasa (GGT)',
      'Bilirrubina total',
      'Bilirrubina directa',
      'Albúmina',
      'Proteínas totales',
      'Tiempo de protrombina (TP)'
    ],
    description: 'Monitorizar la detoxificación, el metabolismo hormonal y la producción de proteínas esenciales.'
  },
  'Función Renal': {
    biomarkers: [
      'Creatinina',
      'Urea',
      'Ácido úrico',
      'Filtrado glomerular estimado (eGFR)',
      'Microalbuminuria',
      'Ratio albúmina/creatinina',
      'Cistatin C',
      'Beta-2 microglobulina'
    ],
    description: 'Comprobar la filtración glomerular y el equilibrio de sales que influyen en tensión arterial y rendimiento.'
  },
  'Perfil Hematológico': {
    biomarkers: [
      'Hemoglobina',
      'Hematocrito',
      'Eritrocitos',
      'VCM (Volumen corpuscular medio)',
      'HCM (Hemoglobina corpuscular media)',
      'CHCM (Concentración de hemoglobina corpuscular media)',
      'Leucocitos',
      'Neutrófilos',
      'Linfocitos',
      'Plaquetas'
    ],
    description: 'Evaluar la capacidad de oxigenación, detectar anemias y medir la calidad de la sangre para el rendimiento.'
  },
  'Nutrientes y Vitaminas': {
    biomarkers: [
      'Vitamina D (25-OH)',
      'Vitamina B12',
      'Ácido fólico',
      'Ferritina',
      'Hierro sérico',
      'Transferrina',
      'Saturación de transferrina',
      'Vitamina B1 (Tiamina)',
      'Vitamina B6 (Piridoxina)',
      'Magnesio',
      'Zinc',
      'Selenio'
    ],
    description: 'Revelar carencias de vitaminas, minerales y ácidos grasos que afectan energía, inmunidad y reparación tisular.'
  },
  'Estrés y Envejecimiento': {
    biomarkers: [
      'Cortisol matutino',
      'Cortisol nocturno',
      'DHEA-S',
      'Ratio cortisol/DHEA',
      'IGF-1',
      'Telómeros',
      'Homocisteína'
    ],
    description: 'Cuantificar el impacto del estrés crónico y estimar tu "edad interna" para enfocar estrategias antienvejecimiento.'
  },
  'Análisis de Orina': {
    biomarkers: [
      'Densidad urinaria',
      'pH urinario',
      'Glucosa en orina',
      'Proteínas en orina',
      'Cetonas en orina',
      'Sangre en orina',
      'Leucocitos en orina',
      'Nitritos en orina',
      'Cristales urinarios'
    ],
    description: 'Reflejar la salud renal, el equilibrio metabólico y posibles infecciones del tracto urinario de forma rápida.'
  },
  'Metales Pesados': {
    biomarkers: [
      'Plomo',
      'Mercurio',
      'Cadmio',
      'Arsénico',
      'Aluminio'
    ],
    description: 'Detectar exposición tóxica a plomo y mercurio que puede dañar cerebro, riñón y sistema inmune a largo plazo.'
  }
};
