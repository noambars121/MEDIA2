import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const GET: APIRoute = async ({ cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response('לא מחובר. יש להתחבר תחילה.', { status: 401 });
  }

  // Use process.env for Supabase credentials
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  // Enroll in TOTP MFA (if not already enrolled)
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
  if (error || !data || !data.totp) {
    return new Response('שגיאה ביצירת קוד MFA. ייתכן שכבר הופעל או שיש לנסות שוב.', { status: 400 });
  }

  // Return the QR code image (data.totp.qr_code)
  const qr = data.totp.qr_code;
  if (!qr) {
    return new Response('לא התקבל קוד QR.', { status: 500 });
  }
  // qr is a data URL (e.g., data:image/svg+xml;base64,...)
  const base64 = qr.split(',')[1];
  const imgBuffer = Buffer.from(base64, 'base64');
  return new Response(imgBuffer, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-store',
    },
  });
}; 