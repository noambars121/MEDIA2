import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const access_token = formData.get('access_token')?.toString();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirm-password')?.toString();
  if (!access_token || !password || !confirmPassword) {
    return new Response('יש למלא את כל השדות.', { status: 400 });
  }
  if (password !== confirmPassword) {
    return new Response('הסיסמאות אינן תואמות.', { status: 400 });
  }
  if (password.length < 6) {
    return new Response('הסיסמה חייבת להכיל לפחות 6 תווים.', { status: 400 });
  }
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${access_token}` } } }
  );
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return new Response('שגיאה באיפוס הסיסמה. נסה/י שוב.', { status: 500 });
  }
  return new Response('הסיסמה אופסה בהצלחה! ניתן להתחבר.', { status: 200 });
}; 