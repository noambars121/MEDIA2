import type { APIRoute } from 'astro';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  topic: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter';
  contentType: 'post' | 'story' | 'reel' | 'carousel';
  tone: 'professional' | 'casual' | 'friendly' | 'enthusiastic' | 'elegant';
  language: 'en' | 'he';
  includeHashtags: boolean;
  clientId?: string;
  customInstructions?: string;
}

interface ClientContext {
  name: string;
  industry?: string;
  brand_voice?: string;
  target_audience?: string;
  brand_guidelines?: string;
}

const PLATFORM_CONFIGS = {
  instagram: {
    maxLength: 2200,
    characteristics: 'visual-focused, hashtag-friendly, engaging captions',
    tips: 'Use emojis, ask questions, encourage engagement',
  },
  facebook: {
    maxLength: 500,
    characteristics: 'conversational, community-focused, longer form acceptable',
    tips: 'Encourage shares and comments, use storytelling',
  },
  linkedin: {
    maxLength: 700,
    characteristics: 'professional, industry-focused, thought leadership',
    tips: 'Share insights, use professional language, include industry keywords',
  },
  tiktok: {
    maxLength: 150,
    characteristics: 'trendy, viral potential, short and catchy',
    tips: 'Use trending terms, create urgency, be authentic',
  },
  twitter: {
    maxLength: 280,
    characteristics: 'concise, real-time, conversation starter',
    tips: 'Be concise, use threads for longer content, engage with trends',
  },
};

const CONTENT_TYPE_INSTRUCTIONS = {
  post: 'Create a standalone social media post',
  story: 'Create engaging story content (temporary, casual format)',
  reel: 'Create short-form video content description and caption',
  carousel: 'Create content for a multi-slide carousel post',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if OpenAI API key is configured
    if (!openai.apiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: GenerateRequest = await request.json();
    const { 
      topic, 
      platform, 
      contentType, 
      tone, 
      language, 
      includeHashtags, 
      clientId, 
      customInstructions 
    } = body;

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

    // Get client context if clientId is provided
    let clientContext: ClientContext | null = null;
    if (clientId) {
      const { data: client } = await supabase
        .from('clients')
        .select('name, industry, brand_voice, target_audience, brand_guidelines')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single();
      
      clientContext = client;
    }

    // Build the prompt
    const platformConfig = PLATFORM_CONFIGS[platform];
    const contentTypeInstruction = CONTENT_TYPE_INSTRUCTIONS[contentType];
    
    let prompt = `You are an expert social media content creator for photographers and videographers. 

${contentTypeInstruction} for ${platform} about "${topic}".

Platform Requirements:
- Platform: ${platform}
- Content Type: ${contentType}
- Max Length: ${platformConfig.maxLength} characters
- Platform Characteristics: ${platformConfig.characteristics}
- Best Practices: ${platformConfig.tips}

Content Requirements:
- Tone: ${tone}
- Language: ${language === 'en' ? 'English' : 'Hebrew'}
- ${includeHashtags ? 'Include relevant hashtags' : 'Do not include hashtags'}`;

    if (clientContext) {
      prompt += `

Client Context:
- Client: ${clientContext.name}
- Industry: ${clientContext.industry || 'Not specified'}
- Brand Voice: ${clientContext.brand_voice || 'Not specified'}
- Target Audience: ${clientContext.target_audience || 'Not specified'}
- Brand Guidelines: ${clientContext.brand_guidelines || 'None specified'}

Please tailor the content to match the client's brand voice and target their specific audience.`;
    }

    if (customInstructions) {
      prompt += `

Additional Instructions:
${customInstructions}`;
    }

    prompt += `

Please provide:
1. The main content/caption
2. ${includeHashtags ? 'Relevant hashtags (separated by spaces)' : ''}
3. A brief tip for optimal posting (timing, engagement strategy, etc.)

Format your response as JSON with the following structure:
{
  "content": "Main content/caption here",
  ${includeHashtags ? '"hashtags": "hashtag1 hashtag2 hashtag3",' : ''}
  "tip": "Posting tip here"
}`;

    // Generate content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert social media content creator specializing in photography and videography businesses. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, try to extract content manually
      parsedResponse = {
        content: aiResponse,
        hashtags: includeHashtags ? '' : undefined,
        tip: 'Post at optimal times for your audience engagement.'
      };
    }

    // Save to database
    const contentData = {
      user_id: user.id,
      client_id: clientId || null,
      platform,
      content_type: contentType,
      topic,
      content: parsedResponse.content,
      hashtags: parsedResponse.hashtags || null,
      tip: parsedResponse.tip || null,
      tone,
      language,
      custom_instructions: customInstructions || null,
      status: 'generated' as const,
      metadata: {
        model: 'gpt-4',
        tokens_used: completion.usage?.total_tokens || 0,
        generation_time: new Date().toISOString()
      }
    };

    const { data: savedContent, error: saveError } = await supabase
      .from('ai_content')
      .insert(contentData)
      .select()
      .single();

    if (saveError) {
      console.error('Error saving content:', saveError);
      // Still return the generated content even if saving fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: {
          id: savedContent?.id || null,
          content: parsedResponse.content,
          hashtags: parsedResponse.hashtags,
          tip: parsedResponse.tip,
          platform,
          contentType,
          tone,
          language,
          createdAt: new Date().toISOString()
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Generation Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to generate content: ${errorMessage}` 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 