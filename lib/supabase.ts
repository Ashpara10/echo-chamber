import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://cpbujobzeuglhlardlez.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwYnVqb2J6ZXVnbGhsYXJkbGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2NzU0MDgsImV4cCI6MjAyODI1MTQwOH0.XN4HmhxYgo4Zj1tM3ZtUVEcjTu4V-BesZFsdAehaEqs"
);

export default supabase;
