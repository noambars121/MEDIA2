import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ cookies }) => {
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
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, phone, avatar_url, business_type, role')
    .eq('id', user.id)
    .single();
  if (profileError) {
    return new Response('שגיאה בטעינת הפרופיל.', { status: 500 });
  }
  return new Response(JSON.stringify({
    email: user.email,
    ...profile
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: APIRoute = async ({ request, cookies }) => {
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
  const formData = await request.formData();
  const full_name = formData.get('full_name')?.toString();
  const phone = formData.get('phone')?.toString();
  const business_type = formData.get('business_type')?.toString();
  const role = formData.get('role')?.toString();
  // TODO: handle avatar upload
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name,
    phone,
    business_type,
    role
  });
  if (error) {
    return new Response('שגיאה בשמירת הפרופיל.', { status: 500 });
  }
  return new Response('הפרופיל נשמר בהצלחה!', { status: 200 });
}; 