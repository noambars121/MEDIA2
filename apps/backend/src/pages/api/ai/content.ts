import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Retrieve AI content history
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse query parameters
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const platform = searchParams.get('platform');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query = supabase
      .from('ai_content')
      .select(`
        *,
        clients(name, industry)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`content.ilike.%${search}%,topic.ilike.%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: content, error, count } = await query;

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({
      success: true,
      data: content,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching AI content:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT: Update AI content
export const PUT: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { id, content, hashtags, callToAction, status, notes } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Content ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update the content
    const { data: updatedContent, error: updateError } = await supabase
      .from('ai_content')
      .update({
        content: content || undefined,
        hashtags: hashtags || undefined,
        call_to_action: callToAction || undefined,
        status: status || undefined,
        notes: notes || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      data: updatedContent
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating AI content:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Delete AI content
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Content ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the content
    const { error: deleteError } = await supabase
      .from('ai_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Content deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting AI content:', error);
    return new Response(JSON.stringify({
      error: 'Failed to delete content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};