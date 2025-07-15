import { supabase } from '../lib/supabase';

export const fetchReportData = async (reportId: string) => {
  console.log('🔍 fetchReportData: Fetching report with ID:', reportId);
  
  const { data: reportData, error: reportError } = await supabase
    .from('reports')
    .select(`
      id,
      created_at,
      diagnosis,
      diagnosis_date,
      vitality_score,
      risk_score,
      average_risk,
      personalized_insights,
      critical_biomarkers,
      manual_notes,
      form_id,
      patient_id,
      analytics_id,
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
    console.error('❌ fetchReportData error:', reportError);
    throw reportError;
  }

  if (!reportData) {
    console.error('❌ fetchReportData: No data found for report ID:', reportId);
    throw new Error('Report not found');
  }

  console.log('✅ fetchReportData: Raw data from database:', reportData);
  console.log('🔍 fetchReportData: Diagnosis field:', reportData.diagnosis);
  console.log('🔍 fetchReportData: Diagnosis type:', typeof reportData.diagnosis);
  
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
  // First get patient_id from the report
  const { data: reportData } = await supabase
    .from('reports')
    .select('patient_id')
    .eq('id', reportId)
    .single();

  if (!reportData?.patient_id) {
    console.warn('No patient_id found for report:', reportId);
    return {
      foods: [],
      lifestyle: [],
      activity: [],
      supplements: [],
      therapy: [],
      followup: []
    };
  }

  const patientId = reportData.patient_id;

  // Fetch from all specialized action plan tables using form_id and patient_id
  const [foods, lifestyle, activity, supplements, therapy, followup] = await Promise.all([
    supabase.from('report_action_plans_foods').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_lifestyle').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_activity').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_supplements').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_therapy').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false }),
    supabase.from('report_action_plans_followup').select('*').eq('form_id', formId).eq('patient_id', patientId).order('priority', { ascending: false })
  ]);

  console.log('Action plans fetched for patient:', patientId, 'form:', formId, {
    foods: foods.data?.length || 0,
    lifestyle: lifestyle.data?.length || 0,
    activity: activity.data?.length || 0,
    supplements: supplements.data?.length || 0,
    therapy: therapy.data?.length || 0,
    followup: followup.data?.length || 0
  });

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
  console.log('Fetching report comments for:', { reportId, formId });
  
  const { data, error } = await supabase
    .from('report_comments')
    .select(`
      id,
      report_id,
      form_id,
      patient_id,
      title,
      content,
      category,
      priority,
      author,
      date,
      created_at,
      evaluation_type,
      target_id,
      evaluation_score,
      criticality_level,
      recommendations,
      is_auto_generated,
      comment_type,
      panel_affected,
      technical_details,
      patient_friendly_content,
      action_steps,
      warning_signs,
      expected_timeline,
      order_index
    `)
    .eq('form_id', formId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching report comments:', error);
    throw error;
  }

  console.log('Report comments fetched:', data);
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
