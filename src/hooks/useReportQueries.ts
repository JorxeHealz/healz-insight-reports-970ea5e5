
import { supabase } from '../lib/supabase';

export const fetchReportData = async (reportId: string) => {
  const { data: reportData, error: reportError } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      diagnosis,
      manual_notes,
      form_id,
      patients!inner (
        id,
        first_name,
        last_name,
        email,
        date_of_birth,
        gender
      )
    `)
    .eq('id', reportId)
    .single();

  if (reportError) {
    console.error('Error fetching report:', reportError);
    throw reportError;
  }

  if (!reportData) {
    throw new Error('Report not found');
  }

  return reportData;
};

export const fetchReportBiomarkers = async (reportId: string) => {
  // Use the updated RPC function that only uses category (no panel column)
  const { data: reportBiomarkers, error } = await supabase
    .rpc('get_report_biomarkers', { p_report_id: reportId });

  if (error) {
    console.error('Error fetching report biomarkers:', error);
    throw error;
  }

  return reportBiomarkers || [];
};

export const fetchReportRiskProfiles = async (reportId: string, formId: string) => {
  const { data } = await supabase
    .from('report_risk_profiles')
    .select('*')
    .eq('report_id', reportId)
    .eq('form_id', formId);

  return data || [];
};

export const fetchReportActionPlans = async (reportId: string, formId: string) => {
  const { data } = await supabase
    .from('report_action_plans')
    .select('*')
    .eq('report_id', reportId)
    .eq('form_id', formId)
    .order('priority', { ascending: false });

  return data || [];
};

export const fetchReportComments = async (reportId: string, formId: string) => {
  const { data } = await supabase
    .from('report_comments')
    .select('*')
    .eq('report_id', reportId)
    .eq('form_id', formId)
    .order('created_at', { ascending: false });

  return data || [];
};

export const fetchReportSymptoms = async (formId: string) => {
  const { data } = await supabase
    .from('questionnaire_answers')
    .select('*')
    .eq('form_id', formId);

  return data || [];
};

export const fetchReportSummarySections = async (reportId: string, formId: string) => {
  const { data } = await supabase
    .from('report_summary_sections')
    .select('*')
    .eq('report_id', reportId)
    .eq('form_id', formId);

  return data || [];
};

