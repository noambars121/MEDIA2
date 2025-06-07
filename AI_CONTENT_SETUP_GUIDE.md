# MediaHand AI Content Generation Setup Guide

## Overview

The AI Content Generation system in MediaHand allows photographers and videographers to create engaging social media content using OpenAI's GPT-4. This system integrates client information, brand guidelines, and platform-specific requirements to generate personalized, high-quality content.

## Features

### 🎯 Smart Content Creation
- **Multi-Platform Support**: Instagram, Facebook, LinkedIn, TikTok, Twitter
- **Content Types**: Posts, Stories, Reels, Carousels
- **Multiple Tones**: Professional, Casual, Friendly, Enthusiastic, Elegant
- **Bilingual Support**: English and Hebrew

### 🧠 Client Intelligence
- **Client Context Integration**: Uses client industry, brand voice, target audience
- **Brand Guidelines**: Incorporates specific brand requirements
- **Personalized Content**: Tailored to individual client needs

### 📊 Content Management
- **Content History**: Track all generated content with searchable history
- **Content Editing**: Edit and refine generated content
- **Status Tracking**: Generated, Edited, Published, Archived
- **Analytics**: Content performance and usage statistics

## Prerequisites

### Required Services
1. **Supabase Account** - Database and authentication
2. **OpenAI Account** - AI content generation
3. **Node.js 18+** - Runtime environment

### Optional Services
- **Stripe Account** - Payment processing (for future features)
- **Google Analytics** - Usage analytics
- **AWS S3** - File storage (alternative to Supabase Storage)

## Installation

### 1. Clone and Setup Project

```bash
# Clone the repository
git clone <your-mediahand-repo>
cd mediahand

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 2. Database Setup

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys from Settings > API

#### Run Database Migrations
```bash
# Apply the AI content migration
psql -h your-supabase-host -U postgres -d postgres -f scripts/ai-content-migration.sql
```

Or use the Supabase dashboard:
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `scripts/ai-content-migration.sql`
3. Run the migration

### 3. Environment Configuration

Edit your `.env` file with the following required variables:

```env
# Supabase (Required)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Application
NODE_ENV=development
PUBLIC_APP_URL=http://localhost:4321
```

### 4. OpenAI Setup

#### Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add it to your `.env` file

#### Configure Usage Limits (Recommended)
1. Set up usage limits in OpenAI dashboard
2. Monitor your usage to avoid unexpected charges
3. Start with a low limit for testing

### 5. Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:4321` and log in to access the AI Content Generator.

## Usage Guide

### 1. Creating Content

#### Basic Content Generation
1. Navigate to "AI Content" in the dashboard
2. **Select Platform**: Choose from Instagram, Facebook, LinkedIn, TikTok, Twitter
3. **Content Type**: Select Post, Story, Reel, or Carousel
4. **Enter Topic**: Describe what you want the content to be about
5. **Choose Tone**: Professional, Casual, Friendly, Enthusiastic, or Elegant
6. **Language**: English or Hebrew
7. **Hashtags**: Toggle whether to include hashtags
8. Click "Generate Content"

#### Client-Specific Content
1. **Select Client**: Choose from your client list for personalized content
2. The AI will use the client's:
   - Industry information
   - Brand voice preferences
   - Target audience data
   - Brand guidelines

#### Custom Instructions
Add specific requirements in the "Custom Instructions" field:
- "Include a call-to-action for booking"
- "Mention our winter discount promotion"
- "Use a storytelling approach"
- "Include specific hashtags: #photography #wedding"

### 2. Managing Generated Content

#### Content History
- View all generated content in the history section
- **Search**: Find content by keywords or topics
- **Filter**: By platform, status, or client
- **Sort**: By creation date, platform, or status

#### Content Actions
- **View Details**: See full content with hashtags and tips
- **Copy**: Copy content to clipboard
- **Edit**: Modify the generated content
- **Delete**: Remove content from history

#### Content Status Management
- **Generated**: Initial AI-generated content
- **Edited**: Content that has been modified
- **Published**: Content that has been posted
- **Archived**: Content no longer in use

### 3. Content Optimization

#### Platform-Specific Features
- **Instagram**: Optimized for visual content, includes relevant hashtags
- **LinkedIn**: Professional tone, industry-focused content
- **Facebook**: Conversational style, longer form content
- **TikTok**: Trending topics, viral-style content
- **Twitter**: Concise, thread-friendly content

#### AI-Generated Suggestions
Each generated content includes:
- **Hashtags**: Relevant and trending hashtags
- **Call-to-Action**: Suggested engagement prompts
- **Content Tips**: Best practices for the specific platform

## Advanced Features

### 1. Content Analytics

Access analytics through the dashboard API:

```typescript
// Get content statistics
const stats = await fetch('/api/ai/analytics', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Returns:
// - Total content generated
// - Content by platform
// - Content by status
// - Monthly trends
// - Most used platforms
// - Average content length
```

### 2. Bulk Content Generation

For multiple pieces of content:

```typescript
const topics = [
  "Behind the scenes of a wedding shoot",
  "Photography equipment recommendations",
  "Client testimonial showcase"
];

for (const topic of topics) {
  await generateContent({
    topic,
    platform: 'instagram',
    contentType: 'post',
    tone: 'friendly'
  });
}
```

### 3. Content Templates

Create reusable content templates for common scenarios:

```typescript
const templates = {
  behindTheScenes: {
    topic: "Behind the scenes content",
    tone: "casual",
    customInstructions: "Show the creative process, include equipment mentions"
  },
  clientShowcase: {
    topic: "Client work showcase",
    tone: "professional", 
    customInstructions: "Focus on results, include client permission note"
  }
};
```

## Troubleshooting

### Common Issues

#### 1. "OpenAI API Key Invalid"
**Solution**: 
- Verify your API key in the OpenAI dashboard
- Ensure the key has the correct permissions
- Check that you have available credits

#### 2. "Content Generation Failed"
**Possible Causes**:
- Rate limit exceeded
- Insufficient OpenAI credits
- Network connectivity issues

**Solutions**:
- Wait and retry (rate limits reset after time)
- Add credits to your OpenAI account
- Check your internet connection

#### 3. "Database Connection Error"
**Solution**:
- Verify Supabase credentials in `.env`
- Check that the database migration was applied
- Ensure RLS policies are correctly set up

#### 4. "Client Data Not Loading"
**Solution**:
- Verify clients exist in your database
- Check that client relationships are properly set up
- Ensure user permissions are correct

### Performance Optimization

#### 1. Content Caching
The system automatically caches generated content to reduce API calls.

#### 2. Rate Limiting
- Implement client-side rate limiting for better UX
- Monitor OpenAI usage to avoid unexpected costs

#### 3. Database Optimization
- The system includes optimized indexes for fast content retrieval
- Use pagination for large content histories

## Security Considerations

### 1. API Key Security
- **Never commit API keys** to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly

### 2. Content Privacy
- All content is user-scoped using Row Level Security
- Client data is encrypted at rest in Supabase
- Implement proper access controls

### 3. Rate Limiting
- Implement user-level rate limiting
- Monitor API usage patterns
- Set up alerts for unusual activity

## Production Deployment

### 1. Environment Setup
```env
NODE_ENV=production
PUBLIC_APP_URL=https://your-domain.com
# Add all required production environment variables
```

### 2. Database Migration
```bash
# Apply migrations to production database
psql -h your-production-supabase-host -U postgres -d postgres -f scripts/ai-content-migration.sql
```

### 3. Build and Deploy
```bash
# Build for production
npm run build

# Deploy to your hosting platform
npm run preview
```

### 4. Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor OpenAI API usage and costs
- Track content generation metrics

## API Reference

### Generate Content
```typescript
POST /api/ai/generate-content
{
  "clientId": "uuid",
  "platform": "instagram",
  "contentType": "post", 
  "topic": "Wedding photography session",
  "tone": "friendly",
  "language": "en",
  "includeHashtags": true,
  "customInstructions": "Include booking CTA"
}
```

### Get Content History
```typescript
GET /api/ai/content?page=1&limit=20&platform=instagram&search=wedding
```

### Update Content
```typescript
PUT /api/ai/content
{
  "id": "content-uuid",
  "content": "Updated content text",
  "status": "edited"
}
```

### Delete Content
```typescript
DELETE /api/ai/content
{
  "id": "content-uuid"
}
```

## Cost Management

### OpenAI Usage Optimization

#### 1. Token Efficiency
- Optimize prompts to reduce token usage
- Use shorter custom instructions when possible
- Cache frequently requested content types

#### 2. Usage Monitoring
```typescript
// Track token usage per request
const completion = await openai.chat.completions.create({
  // ... your request
});

console.log('Tokens used:', completion.usage);
```

#### 3. Budget Controls
- Set up monthly usage limits in OpenAI dashboard
- Implement user-level quotas
- Monitor costs daily

### Cost Estimates
- **Basic Content Generation**: ~500-1000 tokens per request
- **Monthly Cost** (100 requests): ~$2-5 USD
- **Enterprise Usage** (1000+ requests/month): $20-50 USD

## Support and Contributing

### Getting Help
1. Check this documentation
2. Review troubleshooting section
3. Check GitHub issues
4. Contact support

### Contributing
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

### Feedback
We welcome feedback on the AI content generation system:
- Feature requests
- Bug reports
- Performance improvements
- Content quality feedback

## Future Roadmap

### Planned Features
- **Content Scheduling**: Schedule content for optimal posting times
- **A/B Testing**: Test different content variations
- **Performance Analytics**: Track content engagement metrics
- **Content Calendar**: Visual content planning interface
- **Team Collaboration**: Multi-user content review workflows
- **Custom AI Models**: Fine-tuned models for specific industries

### Integration Roadmap
- **Social Media APIs**: Direct posting to platforms
- **Content Management**: Integration with content management systems
- **Analytics Platforms**: Connect with social media analytics tools
- **Design Tools**: Integration with Canva, Figma for visual content

---

## Quick Start Checklist

- [ ] Supabase project created and configured
- [ ] OpenAI API key obtained and added to environment
- [ ] Database migration applied successfully
- [ ] Environment variables configured
- [ ] Development server running
- [ ] First piece of content generated successfully
- [ ] Client data integrated and tested
- [ ] Content history reviewed and managed

Your MediaHand AI Content Generation system is now ready to help you create engaging social media content for your photography and videography business! 🚀📸