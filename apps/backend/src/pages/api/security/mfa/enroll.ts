import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies }) => {
  const accessToken = cookies.get('sb-access-token')?.value;
  if (!accessToken) {
    return new Response('לא מחובר. יש להתחבר תחילה.', { status: 401 });
  }

  const formData = await request.formData();
  const totp = formData.get('totp')?.toString();
  if (!totp) {
    return new Response('יש להזין קוד חד-פעמי.', { status: 400 });
  }

  // Use process.env for Supabase credentials
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  // Get the user's enrolled factors
  const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError || !factorsData || !factorsData.totp || factorsData.totp.length === 0) {
    return new Response('לא נמצאה הרשמת MFA. יש להתחיל תהליך מחדש.', { status: 400 });
  }
  const factor = factorsData.totp[0];

  // Challenge the factor
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
  if (challengeError || !challengeData) {
    return new Response('שגיאה באימות MFA. נסה/י שוב.', { status: 400 });
  }

  // Verify the TOTP code
  const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challengeData.id, code: totp });
  if (verifyError) {
    return new Response('קוד לא תקין. נסה/י שוב.', { status: 400 });
  }

  return new Response('MFA הופעל בהצלחה!', { status: 200 });
}; 