import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

const VALID_ROLES = ['owner', 'team_member', 'client'];

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirm-password')?.toString();
    const businessType = formData.get('business-type')?.toString() || 'photographer';
    const role = formData.get('role')?.toString() || 'owner';

    if (!email || !password || !confirmPassword) {
      return new Response("Please fill in all required fields", { status: 400 });
    }

    if (!VALID_ROLES.includes(role)) {
      return new Response("Invalid user role", { status: 400 });
    }

    if (password !== confirmPassword) {
      return new Response("Passwords do not match", { status: 400 });
    }

    if (password.length < 6) {
      return new Response("Password must be at least 6 characters long", { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response("Please enter a valid email address", { status: 400 });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          business_type: businessType, 
          role: role,
          full_name: email.split('@')[0] // Use email prefix as default name
        },
      },
    });

    if (error) {
      console.error('Registration error:', error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "A user with this email address already exists.";
      } else if (error.message.includes("Password should be at least 6 characters")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message.includes("weak password")) {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }
      
      return new Response(errorMessage, { status: 409 });
    }

    if (data.user && data.user.identities?.length === 0) {
      return new Response("An account with this email already exists. Please check your email or try logging in.", { status: 409 });
    }

    if (data.user && !data.session) {
      return redirect('/check-email');
    }

    // If user is confirmed immediately, redirect to login
    return redirect('/login?message=Registration successful! Please sign in.');

  } catch (error) {
    console.error('Registration API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}; 