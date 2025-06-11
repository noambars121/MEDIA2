import type { APIRoute } from 'astro';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ContentRequest {
  clientId?: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter';
  contentType: 'post' | 'story' | 'reel' | 'carousel';
  topic: string;
  tone: 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant';
  language: 'en' | 'he';
  includeHashtags: boolean;
  customInstructions?: string;
}

const platformSpecs = {
  instagram: {
    maxLength: 2200,
    features: ['hashtags', 'mentions', 'emojis'],
    style: 'visual-first'
  },
  facebook: {
    maxLength: 63206,
    features: ['hashtags', 'mentions', 'links'],
    style: 'conversational'
  },
  linkedin: {
    maxLength: 3000,
    features: ['hashtags', 'mentions', 'professional'],
    style: 'professional'
  },
  tiktok: {
    maxLength: 150,
    features: ['hashtags', 'trending', 'viral'],
    style: 'trendy'
  },
  twitter: {
    maxLength: 280,
    features: ['hashtags', 'mentions', 'threads'],
    style: 'concise'
  }
};

const toneInstructions = {
  professional: 'Use formal, authoritative language with expertise.',
  casual: 'Use relaxed, everyday language that feels approachable.',
  friendly: 'Use warm, welcoming language that builds connection.',
  enthusiastic: 'Use energetic, excited language with passion.',
  elegant: 'Use sophisticated, refined language with class.'
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify user session
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body: ContentRequest = await request.json();
    const { clientId, platform, contentType, topic, tone, language, includeHashtags, customInstructions } = body;

    // Get client information if provided
    let clientContext = '';
    if (clientId) {
      const { data: client } = await supabase
        .from('clients')
        .select('name, industry, brand_voice, target_audience, brand_guidelines')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single();

      if (client) {
        clientContext = `
Client: ${client.name}
Industry: ${client.industry || 'Not specified'}
Brand Voice: ${client.brand_voice || 'Not specified'}
Target Audience: ${client.target_audience || 'Not specified'}
Brand Guidelines: ${client.brand_guidelines || 'Not specified'}
        `;
      }
    }

    // Build the prompt
    const platformSpec = platformSpecs[platform];
    const toneInstruction = toneInstructions[tone];
    
    const systemPrompt = `You are an expert social media content creator specializing in ${platform} content for photographers and videographers. 

Platform Specifications:
- Platform: ${platform.toUpperCase()}
- Content Type: ${contentType}
- Max Length: ${platformSpec.maxLength} characters
- Style: ${platformSpec.style}
- Features: ${platformSpec.features.join(', ')}

Content Requirements:
- Language: ${language === 'en' ? 'English' : 'Hebrew'}
- Tone: ${tone} (${toneInstruction})
- Include hashtags: ${includeHashtags ? 'Yes' : 'No'}
- Topic: ${topic}

${clientContext ? `Client Context:\n${clientContext}` : ''}

${customInstructions ? `Additional Instructions:\n${customInstructions}` : ''}

Create engaging, authentic content that:
1. Resonates with the target audience
2. Follows platform best practices
3. Includes relevant calls-to-action
4. Maintains brand consistency
${includeHashtags ? '5. Includes strategic hashtags' : ''}

Format your response as JSON with:
{
  "content": "main content text",
  "hashtags": ["array", "of", "hashtags"] (if requested),
  "callToAction": "suggested call to action",
  "contentTips": ["tip1", "tip2", "tip3"]
}`;

    const userPrompt = `Create ${platform} ${contentType} content about: ${topic}`;

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Parse the JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (error) {
      // Fallback if JSON parsing fails
      parsedContent = {
        content: generatedContent,
        hashtags: [],
        callToAction: '',
        contentTips: []
      };
    }

    // Save to database
    const { data: savedContent, error: saveError } = await supabase
      .from('ai_content')
      .insert({
        user_id: user.id,
        client_id: clientId || null,
        platform,
        content_type: contentType,
        topic,
        tone,
        language,
        content: parsedContent.content,
        hashtags: parsedContent.hashtags || [],
        call_to_action: parsedContent.callToAction || '',
        content_tips: parsedContent.contentTips || [],
        custom_instructions: customInstructions || null,
        status: 'generated'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving content:', saveError);
      // Don't fail the request, just log the error
    }

    return new Response(JSON.stringify({
      success: true,
      content: {
        id: savedContent?.id,
        ...parsedContent,
        metadata: {
          platform,
          contentType,
          topic,
          tone,
          language,
          clientId,
          createdAt: new Date().toISOString()
        }
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Content Generation Error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};