import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzigxtdsyruphaoktflc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aWd4dGRzeXJ1cGhhb2t0ZmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTIyNzMsImV4cCI6MjA3ODM2ODI3M30.NV6BLMeSBVbp5BylyV6G4tqozYZqtwvKpPOXtSgHVbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);