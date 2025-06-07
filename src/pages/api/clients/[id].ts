import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ cookies, params }) => {
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
  const id = params.id;
  if (!id) {
    return new Response('לא נבחר לקוח.', { status: 400 });
  }
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();
  if (error || !data) {
    return new Response('לקוח לא נמצא או אין הרשאה.', { status: 404 });
  }
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const PATCH: APIRoute = async ({ cookies, params, request }) => {
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
  const id = params.id;
  if (!id) {
    return new Response('לא נבחר לקוח.', { status: 400 });
  }
  const body = await request.json();
  // Only allow updating fields that exist in the table
  const allowedFields = [
    'name', 'email', 'phone', 'business_type', 'classification', 'tags', 'notes',
    'brand_voice', 'content_preferences', 'social_accounts', 'activity_timeline'
  ];
  const updateData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in body) updateData[key] = body[key];
  }
  if (Object.keys(updateData).length === 0) {
    return new Response('אין נתונים לעדכן.', { status: 400 });
  }
  const { error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', id)
    .eq('owner_id', user.id);
  if (error) {
    return new Response('שגיאה בעדכון הלקוח.', { status: 500 });
  }
  return new Response('הלקוח עודכן בהצלחה!', { status: 200 });
}; 