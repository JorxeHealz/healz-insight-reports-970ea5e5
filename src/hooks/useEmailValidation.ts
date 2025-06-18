
import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useEmailValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = async (email: string, excludePatientId?: string) => {
    if (!email) return { isValid: true, message: '' };

    setIsValidating(true);
    
    try {
      let query = supabase
        .from('patients')
        .select('id')
        .eq('email', email.toLowerCase());

      // Excluir el paciente actual si estamos editando
      if (excludePatientId) {
        query = query.neq('id', excludePatientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error validating email:', error);
        return { isValid: true, message: '' }; // En caso de error, permitir continuar
      }

      const emailExists = data && data.length > 0;
      
      return {
        isValid: !emailExists,
        message: emailExists ? 'Ya existe un paciente con este email' : ''
      };
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateEmail,
    isValidating
  };
};
