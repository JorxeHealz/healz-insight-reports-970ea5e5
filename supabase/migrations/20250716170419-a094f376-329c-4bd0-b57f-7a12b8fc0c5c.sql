-- Reset stuck analytics that have been processing for more than 2 hours
UPDATE patient_analytics 
SET status = 'uploaded', 
    updated_at = now()
WHERE status = 'processing' 
AND updated_at < (now() - interval '2 hours');

-- Create function to reset stuck analytics (can be called manually or via cron)
CREATE OR REPLACE FUNCTION reset_stuck_analytics()
RETURNS TABLE(reset_count integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reset_count integer;
BEGIN
  UPDATE patient_analytics 
  SET status = 'uploaded', 
      updated_at = now()
  WHERE status = 'processing' 
  AND updated_at < (now() - interval '2 hours');
  
  GET DIAGNOSTICS reset_count = ROW_COUNT;
  
  RETURN QUERY SELECT reset_count;
END;
$$;