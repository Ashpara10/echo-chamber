import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wylkotpymlovyiicukyz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bGtvdHB5bWxvdnlpaWN1a3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NTg2NDQsImV4cCI6MjAyMjQzNDY0NH0.jWCq3JgVUtNqmQcdK6jsVWH37fQZdkp5304srbSfKLw"
);

export default supabase;
