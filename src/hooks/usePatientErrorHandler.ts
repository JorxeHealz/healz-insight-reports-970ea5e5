
import { PostgrestError } from '@supabase/supabase-js';

export interface PatientError {
  field?: string;
  message: string;
  type: 'validation' | 'database' | 'network' | 'unknown';
}

export const usePatientErrorHandler = () => {
  const parseError = (error: Error | PostgrestError | unknown): PatientError => {
    console.error('Patient operation error:', error);

    // Error de PostgreSQL
    if (error && typeof error === 'object' && 'code' in error) {
      const pgError = error as PostgrestError;
      
      // Error de email duplicado
      if (pgError.code === '23505' && pgError.message?.includes('patients_email_key')) {
        return {
          field: 'email',
          message: 'Ya existe un paciente registrado con este email',
          type: 'validation'
        };
      }

      // Error de constraint violation
      if (pgError.code === '23505') {
        return {
          message: 'Ya existe un registro con estos datos. Verifique la información ingresada.',
          type: 'validation'
        };
      }

      // Error de formato de datos
      if (pgError.code === '22P02') {
        return {
          message: 'Formato de datos inválido. Verifique la información ingresada.',
          type: 'validation'
        };
      }

      // Error de conexión
      if (pgError.code === 'PGRST301') {
        return {
          message: 'Error de conexión. Intente nuevamente.',
          type: 'network'
        };
      }
    }

    // Error de red
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      return {
        message: 'Error de conexión. Verifique su conexión a internet.',
        type: 'network'
      };
    }

    // Error genérico
    return {
      message: error instanceof Error ? error.message : 'Error desconocido al guardar el paciente',
      type: 'unknown'
    };
  };

  return { parseError };
};
