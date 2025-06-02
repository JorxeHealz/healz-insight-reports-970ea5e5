
import { Biomarker } from '../biomarkers/types';

export const getBiomarkerData = (biomarkerName: string, reportBiomarkers: Biomarker[] | undefined) => {
  if (!reportBiomarkers) return null;
  
  // Try to find exact match first
  let match = reportBiomarkers.find(b => 
    b.name.toLowerCase() === biomarkerName.toLowerCase()
  );
  
  // If no exact match, try partial matching
  if (!match) {
    match = reportBiomarkers.find(b => {
      const dbName = b.name.toLowerCase();
      const panelName = biomarkerName.toLowerCase();
      return dbName.includes(panelName.split('(')[0].trim()) || 
             panelName.includes(dbName.split('(')[0].trim());
    });
  }
  
  return match;
};

export const calculatePanelStats = (panelBiomarkers: string[], reportBiomarkers: Biomarker[] | undefined) => {
  const totalBiomarkers = panelBiomarkers.length;
  let measuredCount = 0;
  let outOfRangeCount = 0;
  let cautionCount = 0;

  panelBiomarkers.forEach(biomarkerName => {
    const biomarkerData = getBiomarkerData(biomarkerName, reportBiomarkers);
    if (biomarkerData) {
      measuredCount++;
      if (biomarkerData.status === 'outOfRange') {
        outOfRangeCount++;
      } else if (biomarkerData.status === 'caution') {
        cautionCount++;
      }
    }
  });

  return {
    total: totalBiomarkers,
    measured: measuredCount,
    outOfRange: outOfRangeCount,
    caution: cautionCount,
    alerts: outOfRangeCount + cautionCount
  };
};
