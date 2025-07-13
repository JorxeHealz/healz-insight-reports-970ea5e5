
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
    .eq('form_id', formId)
    .order('created_at', { ascending: false });

  // Get the latest entry for each category
  const latestByCategory = data?.reduce((acc: any[], profile: any) => {
    if (!acc.find(p => p.category === profile.category)) {
      acc.push(profile);
    }
    return acc;
  }, []);

  return latestByCategory || [];
};

export const fetchReportActionPlans = async (reportId: string, formId: string) => {
  // Fetch from all specialized action plan tables
  const [foods, lifestyle, activity, supplements, therapy, followup] = await Promise.all([
    supabase.from('report_action_plans_foods').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_lifestyle').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_activity').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_supplements').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_therapy').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_followup').select('*').eq('report_id', reportId).eq('form_id', formId).order('priority', { ascending: false })
  ]);

  // Combine all results with category labels
  return {
    foods: foods.data || [],
    lifestyle: lifestyle.data || [],
    activity: activity.data || [],
    supplements: supplements.data || [],
    therapy: therapy.data || [],
    followup: followup.data || []
  };
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
    .select(`
      question_id,
      answer,
      form_questions!inner (
        question_text
      )
    `)
    .eq('form_id', formId)
    .eq('form_questions.category', 'current_symptoms');

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

export const fetchReportKeyFindings = async (reportId: string, formId: string) => {
  const { data } = await supabase
    .from('report_key_findings')
    .select('*')
    .or(`report_id.eq.${reportId},form_id.eq.${formId}`)
    .order('order_index', { ascending: true });

  return data || [];
};

