export default function useSupabaseUser(){
  const { data, error } = supabase.auth.getSession();
  const user = data.session.user;
  return user;
}