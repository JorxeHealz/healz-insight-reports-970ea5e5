
export interface MockPatient {
  name: string;
  age: number;
  condition: string;
  formId?: string;
}

export const mockPatients: Record<string, MockPatient> = {
  '550e8400-e29b-41d4-a716-446655440000': {
    name: 'María González',
    age: 45,
    condition: 'Metabolic Syndrome'
  },
  '550e8400-e29b-41d4-a716-446655440001': {
    name: 'Ana López',
    age: 52,
    condition: 'Menopause'
  },
  '550e8400-e29b-41d4-a716-446655440002': {
    name: 'Carlos Rodríguez',
    age: 32,
    condition: 'Athlete with Stress'
  },
  '550e8400-e29b-41d4-a716-446655440003': {
    name: 'Ana López',
    age: 52,
    condition: 'Menopause with Chronic Fatigue',
    formId: '660e8400-e29b-41d4-a716-446655440003'
  }
};
