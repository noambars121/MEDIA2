import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Get authentication token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid authorization' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get search parameters
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0);
    const platform = url.searchParams.get('platform');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    // Build query
    let query = supabase
      .from('ai_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`topic.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: contents, error } = await query;

    if (error) {
      console.error('Error fetching AI content history:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        contents: contents || [],
        total: contents?.length || 0
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Content History Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to fetch content history: ${errorMessage}` 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 