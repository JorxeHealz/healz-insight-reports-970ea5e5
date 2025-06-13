
import { Biomarker } from '../biomarkers/types';

export const getBiomarkerData = (biomarkerName: string, reportBiomarkers: Biomarker[] | undefined) => {
  if (!reportBiomarkers) return null;
  
  // Normalize names for better matching
  const normalizeString = (str: string) => {
    return str.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[ç]/g, 'c')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizedSearchName = normalizeString(biomarkerName);
  
  // Try exact match first
  let match = reportBiomarkers.find(b => 
    normalizeString(b.name) === normalizedSearchName
  );
  
  // If no exact match, try partial matching with common variations
  if (!match) {
    // Common name variations mapping
    const nameVariations: Record<string, string[]> = {
      'apolipoproteína b': ['apo b', 'apob', 'apolipoproteina b'],
      'colesterol total': ['colesterol', 'colesterol total'],
      'colesterol hdl': ['hdl', 'hdl-c', 'colesterol hdl'],
      'ldl-c': ['ldl', 'colesterol ldl', 'ldl-c'],
      'triglicéridos': ['trigliceridios', 'trigliceridos', 'tg'],
      'proteína c reactiva ultrasensible': ['hs-crp', 'crp ultrasensible', 'pcr ultrasensible'],
      'hemoglobina glicosilada': ['hba1c', 'hemoglobina glicosilada', 'glicada'],
      'insulina en ayunas': ['insulina', 'insulina ayunas'],
      'testosterona total': ['testosterona', 'testosterona total'],
      'testosterona libre': ['testosterona libre'],
      'hormona luteinizante': ['lh', 'hormona luteinizante'],
      'hormona foliculoestimulante': ['fsh', 'hormona foliculoestimulante'],
      'dhea-s': ['dhea', 'dheas', 'dhea-s'],
      't4 libre': ['t4l', 't4 libre', 'tiroxina libre'],
      't3 libre': ['t3l', 't3 libre', 'triyodotironina libre'],
      'anticuerpos anti-tpo': ['anti-tpo', 'tpo', 'anticuerpos tpo'],
      'alt': ['alanina aminotransferasa', 'alt', 'gpt'],
      'ast': ['aspartato aminotransferasa', 'ast', 'got'],
      'gamma-glutamil transferasa': ['ggt', 'gamma gt'],
      'vitamina d': ['25-oh vitamina d', 'vitamina d3', '25(oh)d'],
      'vitamina b12': ['cobalamina', 'b12'],
      'ácido fólico': ['folato', 'acido folico'],
      'cortisol matutino': ['cortisol am', 'cortisol mañana'],
      'cortisol nocturno': ['cortisol pm', 'cortisol noche']
    };

    // Try variations
    for (const [standard, variations] of Object.entries(nameVariations)) {
      if (normalizeString(standard) === normalizedSearchName) {
        match = reportBiomarkers.find(b => 
          variations.some(variation => 
            normalizeString(b.name).includes(normalizeString(variation)) ||
            normalizeString(variation).includes(normalizeString(b.name))
          )
        );
        if (match) break;
      }
    }
  }

  // If still no match, try partial matching with key words
  if (!match) {
    const searchWords = normalizedSearchName.split(' ').filter(word => word.length > 2);
    if (searchWords.length > 0) {
      match = reportBiomarkers.find(b => {
        const biomarkerWords = normalizeString(b.name).split(' ');
        return searchWords.every(searchWord => 
          biomarkerWords.some(biomarkerWord => 
            biomarkerWord.includes(searchWord) || searchWord.includes(biomarkerWord)
          )
        );
      });
    }
  }

  return match;
};

export const calculatePanelStats = (panelBiomarkers: string[], reportBiomarkers: Biomarker[] | undefined) => {
  const totalBiomarkers = panelBiomarkers.length;
  let measuredCount = 0;
  let outOfRangeCount = 0;
  let cautionCount = 0;

  console.log('Calculating panel stats for:', panelBiomarkers.length, 'biomarkers');

  panelBiomarkers.forEach(biomarkerName => {
    const biomarkerData = getBiomarkerData(biomarkerName, reportBiomarkers);
    if (biomarkerData) {
      measuredCount++;
      console.log(`Found biomarker: ${biomarkerName} -> ${biomarkerData.name} (${biomarkerData.status})`);
      if (biomarkerData.status === 'outOfRange') {
        outOfRangeCount++;
      } else if (biomarkerData.status === 'caution') {
        cautionCount++;
      }
    } else {
      console.log(`Biomarker not found: ${biomarkerName}`);
    }
  });

  const stats = {
    total: totalBiomarkers,
    measured: measuredCount,
    outOfRange: outOfRangeCount,
    caution: cautionCount,
    alerts: outOfRangeCount + cautionCount
  };

  console.log('Panel stats:', stats);
  return stats;
};
