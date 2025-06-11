import React, { useState } from 'react';

export default function AIContentGenerator({ clients = [] }) {
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    contentType: 'post',
    tone: 'professional',
    language: 'en',
    includeHashtags: true,
    clientId: '',
    customInstructions: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸' },
    { value: 'facebook', label: 'Facebook', icon: '👥' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'twitter', label: 'Twitter', icon: '🐦' },
  ];

  const contentTypes = [
    { value: 'post', label: 'Post', description: 'Standard social media post', icon: '📝' },
    { value: 'story', label: 'Story', description: 'Temporary story content', icon: '📱' },
    { value: 'reel', label: 'Reel/Video', description: 'Short-form video content', icon: '🎬' },
    { value: 'carousel', label: 'Carousel', description: 'Multi-slide post', icon: '🎠' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional', emoji: '💼' },
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'friendly', label: 'Friendly', emoji: '🤗' },
    { value: 'enthusiastic', label: 'Enthusiastic', emoji: '🎉' },
    { value: 'elegant', label: 'Elegant', emoji: '✨' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic for the content');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Import and use Supabase for authentication
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please log in to generate content');
      }
      
      const token = session.access_token;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content');
      }

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      setGeneratedContent(result.content);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Generator Form */}
      <div className="bg-white/5 border border-white/20 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">AI Content Generator</h2>
            <p className="text-gray-400 text-lg">Create engaging social media content with AI</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Topic Input - Full Width */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              ✨ Content Topic *
            </label>
            <div className="relative">
              <textarea
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Describe what you want to create content about..."
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300 h-32 resize-none text-lg"
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                {formData.topic.length}/500
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              🌐 Platform
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => handleInputChange('platform', platform.value)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    formData.platform === platform.value
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/25'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                  disabled={isGenerating}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{platform.icon}</div>
                    <span className={`text-sm font-medium ${formData.platform === platform.value ? 'text-white' : 'text-gray-300'}`}>
                      {platform.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              📄 Content Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('contentType', type.value)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.contentType === type.value
                      ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                  disabled={isGenerating}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <h3 className={`font-semibold text-lg mb-1 ${formData.contentType === type.value ? 'text-white' : 'text-gray-200'}`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-400">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-lg font-semibold text-white mb-4">
              🎭 Tone & Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => handleInputChange('tone', tone.value)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    formData.tone === tone.value
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                      : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                  disabled={isGenerating}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{tone.emoji}</div>
                    <span className={`text-sm font-medium ${formData.tone === tone.value ? 'text-white' : 'text-gray-300'}`}>
                      {tone.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Client Selection */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  👤 Client (Optional)
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300"
                  disabled={isGenerating}
                >
                  <option value="">Select a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `(${client.company})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-2">
                  💡 Selecting a client will personalize content using their brand guidelines
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  🌍 Language
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('language', 'en')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.language === 'en'
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="text-center text-lg font-medium text-white">🇺🇸 English</div>
                  </button>
                  <button
                    onClick={() => handleInputChange('language', 'he')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                      formData.language === 'he'
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="text-center text-lg font-medium text-white">🇮🇱 עברית</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Custom Instructions */}
              <div>
                <label className="block text-lg font-semibold text-white mb-4">
                  ⚙️ Custom Instructions (Optional)
                </label>
                <textarea
                  value={formData.customInstructions}
                  onChange={(e) => handleInputChange('customInstructions', e.target.value)}
                  placeholder="Add specific requirements, mentions, or style preferences..."
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/15 transition-all duration-300 h-32 resize-none"
                  disabled={isGenerating}
                />
              </div>

              {/* Include Hashtags */}
              <div className="flex items-center p-6 bg-white/10 rounded-2xl border border-white/20">
                <input
                  type="checkbox"
                  id="includeHashtags"
                  checked={formData.includeHashtags}
                  onChange={(e) => handleInputChange('includeHashtags', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded-lg focus:ring-blue-500"
                  disabled={isGenerating}
                />
                <label htmlFor="includeHashtags" className="ml-4 text-lg font-medium text-white">
                  Include relevant hashtags
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating Magic...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span>Generate Content</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-6 bg-red-500/20 border-2 border-red-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-2xl">⚠️</span>
                <p className="text-red-300 font-medium text-lg">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="bg-white/5 border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl">
                <span className="text-white text-2xl">✨</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Generated Content</h3>
                <p className="text-gray-400">
                  {generatedContent.platform} • {generatedContent.contentType} • {generatedContent.tone}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full">
              {new Date(generatedContent.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="space-y-6">
            {/* Content Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-white">📝 Content</label>
                <button
                  onClick={() => copyToClipboard(generatedContent.content)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/20">
                <p className="text-white whitespace-pre-wrap leading-relaxed text-lg">{generatedContent.content}</p>
              </div>
            </div>

            {/* Hashtags Section */}
            {generatedContent.hashtags && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-white">#️⃣ Hashtags</label>
                  <button
                    onClick={() => copyToClipboard(generatedContent.hashtags)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 bg-blue-500/20 rounded-full hover:bg-blue-500/30"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="bg-blue-500/20 p-6 rounded-2xl border border-blue-500/30">
                  <p className="text-blue-200 font-medium text-lg">{generatedContent.hashtags}</p>
                </div>
              </div>
            )}

            {/* Tip Section */}
            {generatedContent.tip && (
              <div>
                <label className="text-lg font-semibold text-white mb-4 block">💡 Pro Tip</label>
                <div className="bg-green-500/20 p-6 rounded-2xl border border-green-500/30">
                  <p className="text-green-200 text-lg">{generatedContent.tip}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => copyToClipboard(
                  `${generatedContent.content}${generatedContent.hashtags ? '\n\n' + generatedContent.hashtags : ''}`
                )}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy All
                </div>
              </button>
              <button
                onClick={() => setGeneratedContent(null)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
              >
                ✨ Generate New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 