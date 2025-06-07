import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const totp = formData.get('totp')?.toString();

    if (!email || !password) {
      return new Response("Please fill in all fields", { status: 400 });
    }

    // If TOTP is not provided, try password login
    if (!totp) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = "Login failed. Please check your credentials and try again.";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email address before logging in.";
        } else if (error.message.includes("MFA required")) {
          return new Response('MFA code required', { status: 206 });
        }
        
        return new Response(errorMessage, { status: 401 });
      }

      if (data.user && !data.user.email_confirmed_at) {
        return redirect('/check-email');
      }

      // Set session cookie
      const accessToken = data.session?.access_token;
      const refreshToken = data.session?.refresh_token;
      
      if (!accessToken) {
        return new Response("Authentication failed. No access token received.", { status: 500 });
      }

      // Set cookies for session management
      const headers = new Headers();
      headers.append('Set-Cookie', `sb-access-token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`);
      headers.append('Set-Cookie', `sb-refresh-token=${refreshToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
      headers.append('Location', '/dashboard');

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    // MFA verification logic (simplified for now)
    return new Response('MFA verification not fully implemented yet', { status: 400 });

  } catch (error) {
    console.error('Login API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}; 