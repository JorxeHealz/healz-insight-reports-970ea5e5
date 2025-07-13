
import React from 'react';
import { VitalityScoreCard } from './VitalityScoreCard';
import { QualityOfLifeStars } from './QualityOfLifeStars';
import { RiskBars } from './RiskBars';
import { BiologicalAgeCard } from './BiologicalAgeCard';
import { BiomarkerStatus } from './BiomarkerStatus';
import { SymptomsList } from './SymptomsList';
import { RecentBiomarkers } from './RecentBiomarkers';
import { EditableSummarySection } from './EditableSummarySection';
import { FileText, Heart, Activity, Brain } from 'lucide-react';

type ReportSummaryProps = {
  report: any;
};

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  // Extract report_id from the report data
  const reportId = report.id;
  const summarySections = report.summarySections || {};

  return (
    <div className="space-y-6">
      {/* Resumen Narrativo Principal */}
      <EditableSummarySection
        reportId={reportId}
        formId={report.form_id}
        sectionType="general_summary"
        title="Resumen General"
        content={summarySections.general_summary?.content || report.summary || ''}
        icon={<FileText className="h-4 w-4" />}
        className="col-span-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VitalityScoreCard score={report.vitalityScore} />
          
          {/* Notas de Vitalidad */}
          <EditableSummarySection
            reportId={reportId}
            formId={report.form_id}
            sectionType="vitality_notes"
            title="Notas sobre Vitalidad"
            content={summarySections.vitality_notes?.content || ''}
            icon={<Heart className="h-4 w-4" />}
          />
          
          <QualityOfLifeStars rating={report.qualityOfLife} />
          
          <RiskBars risks={report.risks} />
          
          {/* Notas de Riesgo */}
          <EditableSummarySection
            reportId={reportId}
            formId={report.form_id}
            sectionType="risk_notes"
            title="Notas sobre Factores de Riesgo"
            content={summarySections.risk_notes?.content || ''}
            icon={<Activity className="h-4 w-4" />}
          />
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
          
          {/* Notas de Biomarcadores */}
          <EditableSummarySection
            reportId={reportId}
            formId={report.form_id}
            sectionType="biomarker_notes"
            title="Notas sobre Biomarcadores"
            content={summarySections.biomarker_notes?.content || ''}
            icon={<Brain className="h-4 w-4" />}
          />
          
          <SymptomsList symptoms={report.topSymptoms} />
          
          <RecentBiomarkers 
            reportId={reportId}
            biomarkers={report.recentBiomarkers} 
          />
        </div>
      </div>
    </div>
  );
};
