
import { useQuery } from '@tanstack/react-query';
import {
  fetchReportData,
  fetchReportBiomarkers,
  fetchReportRiskProfiles,
  fetchReportActionPlans,
  fetchReportComments,
  fetchReportSymptoms,
  fetchReportSummarySections,
  fetchReportKeyFindings
} from './useReportQueries';
import {
  transformBiomarkers,
  calculateBiomarkerSummary,
  buildRiskProfile,
  transformSymptoms,
  transformClinicalNotes,
  transformActionPlan,
  transformSummarySections,
  buildTransformedReport
} from '../utils/reportTransformers';

export const useReportData = (reportId: string | undefined) => {
  return useQuery({
    queryKey: ['patient-report', reportId],
    queryFn: async () => {
      if (!reportId) throw new Error('No report ID provided');

      console.log('Fetching report with ID:', reportId);

      // Get the report with patient data and diagnosis from Supabase
      const reportData = await fetchReportData(reportId);

      // Get report-specific biomarkers using report_id (nueva implementación)
      const reportBiomarkers = await fetchReportBiomarkers(reportId);

      // Get report risk profiles using both report_id and form_id for consistency
      const riskProfiles = await fetchReportRiskProfiles(reportId, reportData.form_id);

      // Get report action plans using both report_id and form_id
      const actionPlans = await fetchReportActionPlans(reportId, reportData.form_id);

      // Get report comments/clinical notes using both report_id and form_id
      const clinicalNotes = await fetchReportComments(reportId, reportData.form_id);

      // Get symptoms from questionnaire answers using form_id
      const symptoms = await fetchReportSymptoms(reportData.form_id);

      // Get summary sections using both report_id and form_id
      const summarySections = await fetchReportSummarySections(reportId, reportData.form_id);

      // Get key findings using both report_id and form_id
      const keyFindings = await fetchReportKeyFindings(reportId, reportData.form_id);

      console.log('Report data loaded:', {
        reportData,
        biomarkers: reportBiomarkers?.length,
        riskProfiles: riskProfiles?.length,
        actionPlans: actionPlans?.length,
        clinicalNotes: clinicalNotes?.length,
        symptoms: symptoms?.length,
        summarySections: summarySections?.length,
        keyFindings: keyFindings?.length
      });

      // Extract patient data
      const patient = Array.isArray(reportData.patients) ? reportData.patients[0] : reportData.patients;

      // Calculate biomarker summary from actual data
      const biomarkerSummary = reportBiomarkers ? calculateBiomarkerSummary(reportBiomarkers) : { optimal: 0, caution: 0, outOfRange: 0 };

      // Build risk profile from actual data
      const finalRisks = buildRiskProfile(riskProfiles);

      // Process symptoms from questionnaire answers
      const topSymptoms = transformSymptoms(symptoms);

      // Transform biomarkers for display
      const recentBiomarkers = transformBiomarkers(reportBiomarkers);

      // Transform clinical notes
      const transformedClinicalNotes = transformClinicalNotes(clinicalNotes);

      // Transform action plans to the expected format
      const transformedActionPlan = transformActionPlan(actionPlans);

      // Transform summary sections
      const transformedSummarySections = transformSummarySections(summarySections);

      const transformedReport = buildTransformedReport(
        reportData,
        patient,
        finalRisks,
        biomarkerSummary,
        topSymptoms,
        recentBiomarkers,
        transformedClinicalNotes,
        transformedActionPlan,
        transformedSummarySections
      );

      // Add key findings to the report
      transformedReport.keyFindings = keyFindings;

      console.log('Transformed report:', transformedReport);
      return transformedReport;
    },
    enabled: !!reportId
  });
};
