import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ cookies, url }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response('לא מחובר. יש להתחבר תחילה.', { status: 401 });
  }
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response('שגיאה באימות המשתמש.', { status: 401 });
  }
  const q = url.searchParams.get('q')?.toLowerCase();
  let query = supabase
    .from('clients')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });
  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,tags.cs.{${q}}`);
  }
  const { data, error } = await query;
  if (error) {
    return new Response('שגיאה בטעינת הלקוחות.', { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}; 