
export const getBiomarkerSummaryForPatient = (patientId: string) => {
  // María González (Metabolic Syndrome) - 8 outOfRange, 2 caution, 12 optimal
  if (patientId === '550e8400-e29b-41d4-a716-446655440000') {
    return {
      optimal: 12,
      caution: 2,
      outOfRange: 8
    };
  }

  // Carlos Rodríguez (Athlete with Stress) - 3 outOfRange, 3 caution, 14 optimal
  if (patientId === '550e8400-e29b-41d4-a716-446655440002') {
    return {
      optimal: 14,
      caution: 3,
      outOfRange: 3
    };
  }

  // Ana López (Menopause) - 8 outOfRange, 1 caution, 11 optimal
  if (patientId === '550e8400-e29b-41d4-a716-446655440001') {
    return {
      optimal: 11,
      caution: 1,
      outOfRange: 8
    };
  }

  // Default fallback
  return {
    optimal: 12,
    caution: 3,
    outOfRange: 8
  };
};
