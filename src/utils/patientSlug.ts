
import type { Tables } from '../integrations/supabase/types';

type Patient = Tables<'patients'>;

export const generatePatientSlug = (patient: Patient): string => {
  const fullName = `${patient.first_name} ${patient.last_name}`;
  
  // Convertir a minúsculas y reemplazar caracteres especiales
  const normalizedName = fullName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .trim();

  // Tomar los primeros 8 caracteres del ID para el slug
  const shortId = patient.id.substring(0, 8);
  
  return `${normalizedName}-${shortId}`;
};

export const parsePatientIdFromSlug = (slug: string): string | null => {
  // El ID está en los últimos 8 caracteres después del último guión
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  if (lastPart && lastPart.length === 8) {
    return lastPart;
  }
  
  return null;
};

export const findPatientBySlug = (patients: Patient[], slug: string): Patient | null => {
  const shortId = parsePatientIdFromSlug(slug);
  if (!shortId) return null;
  
  return patients.find(patient => patient.id.startsWith(shortId)) || null;
};
