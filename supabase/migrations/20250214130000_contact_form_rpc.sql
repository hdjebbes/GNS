-- Contact form submit via RPC so anon can insert without relying on table RLS.
-- SECURITY DEFINER runs as owner and bypasses RLS on contact_submissions.

CREATE OR REPLACE FUNCTION public.submit_contact_form(
  p_name text,
  p_email text,
  p_message text,
  p_language text DEFAULT 'en',
  p_user_agent text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF length(trim(p_name)) < 2 OR length(trim(p_name)) > 100 THEN
    RAISE EXCEPTION 'Invalid name';
  END IF;
  IF p_email IS NULL OR trim(p_email) !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF length(trim(p_message)) < 10 OR length(trim(p_message)) > 2000 THEN
    RAISE EXCEPTION 'Invalid message';
  END IF;

  INSERT INTO public.contact_submissions (name, email, message, language, ip_address, user_agent)
  VALUES (
    trim(p_name),
    lower(trim(p_email)),
    trim(p_message),
    coalesce(nullif(trim(p_language), ''), 'en'),
    NULL,
    p_user_agent
  );
  RETURN jsonb_build_object('ok', true);
END;
$$;

COMMENT ON FUNCTION public.submit_contact_form IS 'Allows anon to submit contact form; bypasses RLS via SECURITY DEFINER.';

GRANT EXECUTE ON FUNCTION public.submit_contact_form TO anon;
GRANT EXECUTE ON FUNCTION public.submit_contact_form TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_contact_form TO service_role;
