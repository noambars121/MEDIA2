import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();
  if (!email) {
    return new Response('יש להזין כתובת אימייל.', { status: 400 });
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.PUBLIC_SITE_URL || 'http://localhost:4321'}/reset-password`,
  });
  if (error) {
    return new Response('שגיאה בשליחת קישור לאיפוס סיסמה. נסה/י שוב.', { status: 500 });
  }
  return new Response('קישור לאיפוס סיסמה נשלח לאימייל שלך.', { status: 200 });
}; 