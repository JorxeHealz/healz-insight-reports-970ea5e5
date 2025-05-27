
import { BiomarkerInfoData } from './types';

export const getBiomarkerInfo = (name: string): BiomarkerInfoData => {
  const biomarkerInfo: Record<string, BiomarkerInfoData> = {
    "Cortisol": {
      description: "El cortisol es una hormona producida por las glándulas suprarrenales y está relacionada con el estrés.",
      reference: "Referencia: 8 - 25 µg/dL (mañana), 2 - 9 µg/dL (tarde)",
      importance: "El cortisol ayuda a regular el metabolismo, reducir la inflamación y controlar la respuesta al estrés.",
      highLevels: "Los niveles elevados pueden indicar síndrome de Cushing, estrés crónico o problemas de las glándulas suprarrenales.",
      lowLevels: "Los niveles bajos pueden estar asociados con enfermedad de Addison o insuficiencia suprarrenal."
    },
    "Vitamina D": {
      description: "La vitamina D es crucial para la absorción de calcio y la salud ósea.",
      reference: "Referencia: 30 - 80 ng/mL",
      importance: "La vitamina D ayuda a mantener la salud ósea, la función inmunológica y la regulación hormonal.",
      highLevels: "Niveles muy altos pueden causar hipercalcemia y daño renal.",
      lowLevels: "Niveles bajos están asociados con densidad ósea reducida, fatiga y mayor susceptibilidad a infecciones."
    },
    "Glucosa": {
      description: "La glucosa es la principal fuente de energía para las células del cuerpo.",
      reference: "Referencia: 70 - 99 mg/dL (en ayunas)",
      importance: "Mantener niveles óptimos de glucosa es esencial para el metabolismo energético.",
      highLevels: "Niveles elevados pueden indicar prediabetes o diabetes.",
      lowLevels: "Niveles bajos pueden causar hipoglucemia, mareos y fatiga."
    },
    "TSH": {
      description: "La hormona estimulante de la tiroides (TSH) regula la producción de hormonas tiroideas.",
      reference: "Referencia: 0.4 - 4.0 mU/L",
      importance: "La TSH es fundamental para el metabolismo basal y la función tiroidea.",
      highLevels: "Niveles altos pueden indicar hipotiroidismo.",
      lowLevels: "Niveles bajos pueden indicar hipertiroidismo."
    },
    "Ferritina": {
      description: "La ferritina es una proteína que almacena hierro y lo libera de forma controlada.",
      reference: "Referencia: 20 - 250 ng/mL (hombres), 10 - 120 ng/mL (mujeres)",
      importance: "La ferritina es un indicador de los niveles de hierro almacenados en el cuerpo.",
      highLevels: "Niveles altos pueden indicar sobrecarga de hierro, inflamación o enfermedad hepática.",
      lowLevels: "Niveles bajos pueden indicar deficiencia de hierro o anemia."
    }
  };

  return biomarkerInfo[name] || {
    description: "Información no disponible para este biomarcador.",
    reference: "Referencia: No disponible",
    importance: "Importancia: No disponible"
  };
};
