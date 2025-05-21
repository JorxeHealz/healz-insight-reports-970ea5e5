
# Healz Reports Documentation

This document provides information about the Healz Reports module, its API endpoints, and hooks.

## Data Model

### Tables

1. **patients**
   - `id` (UUID)
   - `created_at` (timestamp)
   - `name` (string)
   - `email` (string)
   - `age` (number)
   - `gender` (string)

2. **biomarkers**
   - `id` (UUID)
   - `created_at` (timestamp)
   - `patient_id` (UUID, foreign key to patients.id)
   - `type` (string)
   - `value` (number)
   - `unit` (string)
   - `date` (timestamp)

3. **questionnaire_answers**
   - `id` (UUID)
   - `created_at` (timestamp)
   - `patient_id` (UUID, foreign key to patients.id)
   - `question_id` (string)
   - `answer` (string or number)
   - `date` (timestamp)

4. **reports**
   - `id` (UUID)
   - `created_at` (timestamp)
   - `patient_id` (UUID, foreign key to patients.id)
   - `diagnosis` (JSON)
   - `pdf_url` (string, nullable)
   - `doctor_id` (string, nullable)

### Views

1. **patient_snapshot**
   - `patient_id` (UUID)
   - `biomarker_type` (string)
   - `latest_value` (number)
   - `unit` (string)
   - `latest_date` (timestamp)

## API Endpoints

### Edge Functions

1. **POST /api/diagnosis**
   - Generates a diagnosis based on patient data
   - Request:
     ```json
     {
       "patient_id": "uuid"
     }
     ```
   - Response:
     ```json
     {
       "vitalityScore": 85,
       "riskScore": 25,
       "riskProfile": {
         "cardio": "low",
         "mental": "medium",
         "adrenal": "low",
         "metabolic": "low"
       },
       "summary": "Patient shows good overall health metrics..."
     }
     ```

## React Hooks

### usePatients

```typescript
const { data: patients, isLoading, error } = usePatients(searchTerm);
```

Fetches patients from the database, with optional filtering.

### useBiomarkers

```typescript
const { data: biomarkers, isLoading, error } = useBiomarkers(patientId);
```

Fetches biomarker data for a specific patient.

### useQuestionnaireAnswers

```typescript
const { data: answers, isLoading, error } = useQuestionnaireAnswers(patientId);
```

Fetches questionnaire answers for a specific patient.

### useReports

```typescript
const { data: reports, isLoading, error } = useReports(patientId);
```

Fetches reports for a specific patient. If `patientId` is omitted, fetches all reports.

### useDiagnosis

```typescript
const { diagnose, isLoading, error, diagnosis } = useDiagnosis();
```

Hook for generating a diagnosis for a patient.

Usage:

```typescript
const { diagnose } = useDiagnosis();

// Later in your component
const handleGenerateDiagnosis = async () => {
  await diagnose(patientId);
};
```
