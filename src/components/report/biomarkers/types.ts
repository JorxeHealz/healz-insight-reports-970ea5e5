
export interface Biomarker {
  name: string;
  valueWithUnit: string;
  status: 'optimal' | 'caution' | 'outOfRange';
  collectedAgo: string;
}

export interface BiomarkerInfoData {
  description: string;
  reference: string;
  importance: string;
  highLevels?: string;
  lowLevels?: string;
}
