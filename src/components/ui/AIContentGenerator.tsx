import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Zap, Target, Settings, Copy, Download, Edit, Save, Trash2 } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

interface Client {
  id: string;
  name: string;
  industry?: string;
  brand_voice?: string;
  target_audience?: string;
}

interface GeneratedContent {
  id?: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  contentTips: string[];
  metadata: {
    platform: string;
    contentType: string;
    topic: string;
    tone: string;
    language: string;
    clientId?: string;
    createdAt: string;
  };
}

interface AIContentGeneratorProps {
  clients?: Client[];
  onContentGenerated?: (content: GeneratedContent) => void;
}

const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { value: 'facebook', label: 'Facebook', icon: '👥', color: 'bg-blue-600' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-black' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'bg-gray-800' }
];

const contentTypeOptions = {
  instagram: [
    { value: 'post', label: 'Feed Post' },
    { value: 'story', label: 'Story' },
    { value: 'reel', label: 'Reel' },
    { value: 'carousel', label: 'Carousel' }
  ],
  facebook: [
    { value: 'post', label: 'Post' },
    { value: 'story', label: 'Story' }
  ],
  linkedin: [
    { value: 'post', label: 'Post' },
    { value: 'story', label: 'Story' }
  ],
  tiktok: [
    { value: 'post', label: 'Video Post' }
  ],
  twitter: [
    { value: 'post', label: 'Tweet' }
  ]
};

const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal, authoritative' },
  { value: 'casual', label: 'Casual', description: 'Relaxed, approachable' },
  { value: 'friendly', label: 'Friendly', description: 'Warm, welcoming' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic, passionate' },
  { value: 'elegant', label: 'Elegant', description: 'Sophisticated, refined' }
];

export const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  clients = [],
  onContentGenerated
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    platform: 'instagram',
    contentType: 'post',
    topic: '',
    tone: 'professional',
    language: 'en',
    includeHashtags: true,
    customInstructions: ''
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState<string>('');

  const availableContentTypes = contentTypeOptions[formData.platform as keyof typeof contentTypeOptions] || [];

  // Reset content type when platform changes
  useEffect(() => {
    const newContentTypes = contentTypeOptions[formData.platform as keyof typeof contentTypeOptions] || [];
    if (!newContentTypes.find(ct => ct.value === formData.contentType)) {
      setFormData(prev => ({ ...prev, contentType: newContentTypes[0]?.value || 'post' }));
    }
  }, [formData.platform]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const generateContent = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic for your content');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Get auth token from local storage or your auth system
      const token = localStorage.getItem('supabase_access_token');
      
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content');
      }

      setGeneratedContent(result.content);
      setEditedContent(result.content.content);
      onContentGenerated?.(result.content);

    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEditedContent = async () => {
    if (!generatedContent?.id) return;

    try {
      const token = localStorage.getItem('supabase_access_token');
      
      const response = await fetch('/api/ai/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: generatedContent.id,
          content: editedContent
        })
      });

      if (response.ok) {
        setGeneratedContent(prev => prev ? { ...prev, content: editedContent } : null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const selectedPlatform = platformOptions.find(p => p.value === formData.platform);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Generation Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
            <p className="text-gray-600">Create engaging social media content with AI</p>
          </div>
        </div>

        {/* Client Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Client (Optional)
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => handleInputChange('clientId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select a client for personalized content</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} {client.industry && `(${client.industry})`}
              </option>
            ))}
          </select>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platformOptions.map(platform => (
              <button
                key={platform.value}
                onClick={() => handleInputChange('platform', platform.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formData.platform === platform.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{platform.icon}</span>
                  <span className="font-medium">{platform.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Content Type
          </label>
          <select
            value={formData.contentType}
            onChange={(e) => handleInputChange('contentType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {availableContentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Topic / Subject
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="e.g., Behind the scenes of a wedding shoot"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tone & Style
          </label>
          <div className="grid grid-cols-1 gap-2">
            {toneOptions.map(tone => (
              <button
                key={tone.value}
                onClick={() => handleInputChange('tone', tone.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  formData.tone === tone.value
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-sm text-gray-500">{tone.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Language & Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="he">Hebrew</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hashtags
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.includeHashtags}
                onChange={(e) => handleInputChange('includeHashtags', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include hashtags</span>
            </label>
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Custom Instructions (Optional)
          </label>
          <TextareaAutosize
            value={formData.customInstructions}
            onChange={(e) => handleInputChange('customInstructions', e.target.value)}
            placeholder="Any specific requirements or style preferences..."
            minRows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateContent}
          disabled={isGenerating || !formData.topic.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Content
            </>
          )}
        </button>
      </div>

      {/* Generated Content Display */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {generatedContent ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedPlatform?.color || 'bg-gray-500'}`}>
                  <span className="text-white text-xl">{selectedPlatform?.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Generated Content</h3>
                  <p className="text-sm text-gray-500">
                    {selectedPlatform?.label} • {formData.contentType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => copyToClipboard(generatedContent.content)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <TextareaAutosize
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      minRows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditedContent}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedContent(generatedContent.content);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="whitespace-pre-wrap text-gray-900">{generatedContent.content}</p>
                  </div>
                )}
              </div>

              {/* Hashtags */}
              {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Hashtags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              {generatedContent.callToAction && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action
                  </label>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">{generatedContent.callToAction}</p>
                  </div>
                </div>
              )}

              {/* Content Tips */}
              {generatedContent.contentTips && generatedContent.contentTips.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Tips
                  </label>
                  <ul className="space-y-2">
                    {generatedContent.contentTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Target className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
            <p className="text-gray-500">
              Fill out the form and click "Generate Content" to create your AI-powered social media content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};