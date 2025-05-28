
import React from 'react';
import { VitalityScoreCard } from './VitalityScoreCard';
import { QualityOfLifeStars } from './QualityOfLifeStars';
import { RiskBars } from './RiskBars';
import { BiologicalAgeCard } from './BiologicalAgeCard';
import { BiomarkerStatus } from './BiomarkerStatus';
import { SymptomsList } from './SymptomsList';
import { RecentBiomarkers } from './RecentBiomarkers';

type ReportSummaryProps = {
  report: any; // We'd ideally create a proper type for this
  patientId?: string; // Add patientId for real data integration
};

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report, patientId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <VitalityScoreCard score={report.vitalityScore} />
        <QualityOfLifeStars rating={report.qualityOfLife} />
        <RiskBars risks={report.risks} />
      </div>
      
      <div className="space-y-6">
        <BiologicalAgeCard 
          biologicalAge={report.biologicalAge} 
          chronologicalAge={report.chronologicalAge} 
        />
        <BiomarkerStatus 
          patientId={patientId}
          summary={report.biomarkerSummary} 
        />
        <SymptomsList symptoms={report.topSymptoms} />
        <RecentBiomarkers 
          patientId={patientId}
          biomarkers={report.recentBiomarkers} 
        />
      </div>
    </div>
  );
};
