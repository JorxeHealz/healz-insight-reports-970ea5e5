
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('patient-files', 'patient-files', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

-- Create RLS policies for the patient-files bucket
CREATE POLICY "Allow public insert for patient files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'patient-files');

CREATE POLICY "Allow authenticated users to view patient files" ON storage.objects
FOR SELECT USING (bucket_id = 'patient-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role full access to patient files" ON storage.objects
FOR ALL USING (bucket_id = 'patient-files' AND auth.role() = 'service_role');
