
import React from 'react';
import { VitalityScoreCard } from './VitalityScoreCard';
import { QualityOfLifeStars } from './QualityOfLifeStars';
import { RiskBars } from './RiskBars';
import { BiologicalAgeCard } from './BiologicalAgeCard';
import { BiomarkerStatus } from './BiomarkerStatus';
import { SymptomsList } from './SymptomsList';
import { RecentBiomarkers } from './RecentBiomarkers';

type ReportSummaryProps = {
  report: any;
};

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  // Extract report_id from the report data
  const reportId = report.id;

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
          reportId={reportId}
          summary={report.biomarkerSummary} 
        />
        <SymptomsList symptoms={report.topSymptoms} />
        <RecentBiomarkers 
          reportId={reportId}
          biomarkers={report.recentBiomarkers} 
        />
      </div>
    </div>
  );
};
