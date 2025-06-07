import type { MiddlewareHandler } from 'astro';
import { supabase } from '@/lib/supabase';

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { request, redirect, cookies } = context;
  const url = new URL(request.url);
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/clients', '/projects', '/profile', '/media', '/analytics'];
  const authRoutes = ['/login', '/register'];
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => url.pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Get tokens from cookies
    const accessToken = cookies.get('sb-access-token')?.value;
    const refreshToken = cookies.get('sb-refresh-token')?.value;
    
    if (!accessToken) {
      // No access token, redirect to login
      return redirect('/login?message=Please log in to access this page');
    }
    
    try {
      // Verify the session with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (error || !user) {
        // Invalid token, try to refresh if refresh token exists
        if (refreshToken) {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
          });
          
          if (refreshError || !refreshData.session) {
            // Refresh failed, clear cookies and redirect
            cookies.delete('sb-access-token');
            cookies.delete('sb-refresh-token');
            return redirect('/login?message=Session expired. Please log in again.');
          }
          
          // Update cookies with new tokens
          cookies.set('sb-access-token', refreshData.session.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600,
            path: '/'
          });
          
          if (refreshData.session.refresh_token) {
            cookies.set('sb-refresh-token', refreshData.session.refresh_token, {
              httpOnly: true,
              sameSite: 'lax',
              maxAge: 604800,
              path: '/'
            });
          }
        } else {
          // No refresh token, redirect to login
          cookies.delete('sb-access-token');
          return redirect('/login?message=Session expired. Please log in again.');
        }
      }
      
      // User is authenticated, continue to the requested page
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Clear potentially corrupted cookies
      cookies.delete('sb-access-token');
      cookies.delete('sb-refresh-token');
      return redirect('/login?message=Authentication error. Please log in again.');
    }
  }
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute) {
    const accessToken = cookies.get('sb-access-token')?.value;
    if (accessToken) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (!error && user) {
          return redirect('/dashboard');
        }
      } catch (error) {
        // Continue to auth route if there's an error
      }
    }
  }
  
  return next();
}; 