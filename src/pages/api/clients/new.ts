import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

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
  const name = formData.get('name')?.toString();
  if (!name) {
    return new Response('יש להזין שם לקוח.', { status: 400 });
  }
  const email = formData.get('email')?.toString();
  const phone = formData.get('phone')?.toString();
  const business_type = formData.get('business_type')?.toString();
  const classification = formData.get('classification')?.toString();
  const tagsRaw = formData.get('tags')?.toString();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const notes = formData.get('notes')?.toString();
  const { error } = await supabase.from('clients').insert({
    owner_id: user.id,
    name,
    email,
    phone,
    business_type,
    classification,
    tags,
    notes
  });
  if (error) {
    return new Response('שגיאה בשמירת הלקוח.', { status: 500 });
  }
  return new Response('הלקוח נשמר בהצלחה!', { status: 200 });
}; 