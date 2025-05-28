
import { BiomarkerRow } from '../components/report/biomarkers/types';

export type BiomarkerStatus = 'optimal' | 'caution' | 'outOfRange';

export interface BiomarkerEvaluation {
  status: BiomarkerStatus;
  isQualitative: boolean;
  message?: string;
}

/**
 * Evaluates biomarker status based on value and ranges from Supabase
 */
export function evaluateBiomarkerStatus(
  value: number | string,
  biomarker: BiomarkerRow
): BiomarkerEvaluation {
  // Handle qualitative biomarkers (text values)
  if (typeof value === 'string' || !biomarker.optimal_min || !biomarker.optimal_max) {
    return {
      status: 'optimal',
      isQualitative: true,
      message: 'Resultado cualitativo'
    };
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
  
  if (isNaN(numericValue)) {
    return {
      status: 'optimal',
      isQualitative: true,
      message: 'Valor no numérico'
    };
  }

  // Check optimal range first
  if (numericValue >= biomarker.optimal_min && numericValue <= biomarker.optimal_max) {
    return {
      status: 'optimal',
      isQualitative: false
    };
  }

  // Check conventional range
  if (numericValue >= biomarker.conventional_min && numericValue <= biomarker.conventional_max) {
    return {
      status: 'caution',
      isQualitative: false
    };
  }

  // Outside conventional range
  return {
    status: 'outOfRange',
    isQualitative: false
  };
}

/**
 * Gets display message for biomarker status
 */
export function getBiomarkerStatusMessage(status: BiomarkerStatus): string {
  switch (status) {
    case 'optimal':
      return 'Óptimo';
    case 'caution':
      return 'Precaución';
    case 'outOfRange':
      return 'Fuera de rango';
  }
}

/**
 * Formats biomarker value with unit
 */
export function formatBiomarkerValue(value: number | string, unit: string): string {
  if (typeof value === 'string') {
    return value;
  }
  
  // Format numeric values appropriately
  const numericValue = Number(value);
  if (numericValue % 1 === 0) {
    return `${numericValue} ${unit}`;
  } else {
    return `${numericValue.toFixed(2)} ${unit}`;
  }
}
