
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

  // Tomar los primeros 16 caracteres del ID para mayor unicidad
  const shortId = patient.id.substring(0, 16);
  
  console.log('generatePatientSlug: Full ID:', patient.id, 'Short ID:', shortId, 'Length:', shortId.length);
  
  return `${normalizedName}-${shortId}`;
};

export const parsePatientIdFromSlug = (slug: string): string | null => {
  console.log('parsePatientIdFromSlug: Processing slug:', slug);
  
  // El ID está después del último guión
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  console.log('parsePatientIdFromSlug: Last part:', lastPart, 'Length:', lastPart?.length);
  
  // Aceptar tanto 15 como 16 caracteres para compatibilidad con slugs existentes
  if (lastPart && (lastPart.length === 15 || lastPart.length === 16)) {
    console.log('parsePatientIdFromSlug: Valid short ID found:', lastPart);
    return lastPart;
  }
  
  console.log('parsePatientIdFromSlug: Invalid short ID length or format');
  return null;
};

export const findPatientBySlug = (patients: Patient[], slug: string): Patient | null => {
  const shortId = parsePatientIdFromSlug(slug);
  if (!shortId) {
    console.log('findPatientBySlug: No valid short ID found in slug');
    return null;
  }
  
  const foundPatient = patients.find(patient => patient.id.startsWith(shortId));
  console.log('findPatientBySlug: Found patient:', foundPatient ? `${foundPatient.first_name} ${foundPatient.last_name}` : 'None');
  
  return foundPatient || null;
};
