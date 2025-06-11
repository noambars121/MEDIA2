import React, { useState } from 'react';

interface ClientOnboardingData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  
  // Business Details
  industry: string;
  business_type: 'individual' | 'small_business' | 'enterprise' | 'agency';
  company_size: string;
  annual_budget: string;
  
  // Project Preferences
  preferred_services: string[];
  project_timeline: string;
  communication_preferences: string[];
  
  // Brand & Style
  brand_voice: string;
  target_audience: string;
  brand_guidelines: string;
  style_preferences: string[];
  
  // Contact & Location
  address: string;
  city: string;
  state: string;
  zip_code: string;
  timezone: string;
  
  // Social Media
  social_media: {
    instagram: string;
    facebook: string;
    linkedin: string;
    tiktok: string;
    twitter: string;
  };
  
  // Additional Info
  how_they_found_us: string;
  special_requirements: string;
  notes: string;
}

interface ClientOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ClientOnboardingData) => void;
}

export default function ClientOnboardingWizard({ isOpen, onClose, onComplete }: ClientOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClientOnboardingData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    industry: '',
    business_type: 'individual',
    company_size: '',
    annual_budget: '',
    preferred_services: [],
    project_timeline: '',
    communication_preferences: [],
    brand_voice: '',
    target_audience: '',
    brand_guidelines: '',
    style_preferences: [],
    address: '',
    city: '',
    state: '',
    zip_code: '',
    timezone: '',
    social_media: {
      instagram: '',
      facebook: '',
      linkedin: '',
      tiktok: '',
      twitter: ''
    },
    how_they_found_us: '',
    special_requirements: '',
    notes: ''
  });

  const totalSteps = 6;

  const industries = [
    'Wedding Photography', 'Corporate Events', 'Real Estate', 'Fashion', 
    'Food & Beverage', 'Product Photography', 'Portrait Photography',
    'Architecture', 'Travel & Tourism', 'Sports', 'Entertainment', 'Other'
  ];

  const services = [
    'Photography', 'Videography', 'Photo Editing', 'Video Editing',
    'Drone Photography', 'Event Coverage', 'Product Shoots', 'Portraits',
    'Social Media Content', 'Commercial Photography', 'Branding', 'Marketing'
  ];

  const stylePreferences = [
    'Modern & Clean', 'Vintage & Classic', 'Bold & Dramatic', 'Soft & Romantic',
    'Industrial', 'Minimalist', 'Artistic & Creative', 'Natural & Candid',
    'High Fashion', 'Documentary Style'
  ];

  const communicationMethods = [
    'Email', 'Phone', 'Text/SMS', 'Video Call', 'In-Person Meetings', 
    'Project Management Tools', 'Social Media'
  ];

  const handleInputChange = (field: keyof ClientOnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof ClientOnboardingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) 
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : [value]
    }));
  };

  const handleSocialMediaChange = (platform: keyof ClientOnboardingData['social_media'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: { ...prev.social_media, [platform]: value }
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
    onClose();
  };

  if (!isOpen) return null;

  const stepTitles = [
    'Basic Information',
    'Business Details', 
    'Project Preferences',
    'Brand & Style',
    'Contact & Location',
    'Final Details'
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Client Onboarding</h2>
            <p className="text-gray-400">Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    i + 1 < currentStep ? 'bg-blue-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Let's start with the basics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Enter client's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="Company or organization name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Tell us about your business</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry} className="bg-gray-800">{industry}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Business Type</label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="individual" className="bg-gray-800">Individual</option>
                    <option value="small_business" className="bg-gray-800">Small Business</option>
                    <option value="enterprise" className="bg-gray-800">Enterprise</option>
                    <option value="agency" className="bg-gray-800">Agency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Company Size</label>
                  <select
                    value={formData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select size</option>
                    <option value="1" className="bg-gray-800">Just me</option>
                    <option value="2-10" className="bg-gray-800">2-10 employees</option>
                    <option value="11-50" className="bg-gray-800">11-50 employees</option>
                    <option value="51-200" className="bg-gray-800">51-200 employees</option>
                    <option value="200+" className="bg-gray-800">200+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Annual Budget</label>
                  <select
                    value={formData.annual_budget}
                    onChange={(e) => handleInputChange('annual_budget', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="" className="bg-gray-800">Select budget range</option>
                    <option value="under_5k" className="bg-gray-800">Under $5,000</option>
                    <option value="5k_15k" className="bg-gray-800">$5,000 - $15,000</option>
                    <option value="15k_50k" className="bg-gray-800">$15,000 - $50,000</option>
                    <option value="50k_100k" className="bg-gray-800">$50,000 - $100,000</option>
                    <option value="100k_plus" className="bg-gray-800">$100,000+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Project preferences & timeline</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-4">Preferred Services</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map(service => (
                    <button
                      key={service}
                      onClick={() => handleArrayToggle('preferred_services', service)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.preferred_services.includes(service)
                          ? 'border-blue-500 bg-blue-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Project Timeline</label>
                <select
                  value={formData.project_timeline}
                  onChange={(e) => handleInputChange('project_timeline', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="" className="bg-gray-800">Select timeline</option>
                  <option value="asap" className="bg-gray-800">ASAP</option>
                  <option value="1_month" className="bg-gray-800">Within 1 month</option>
                  <option value="3_months" className="bg-gray-800">Within 3 months</option>
                  <option value="6_months" className="bg-gray-800">Within 6 months</option>
                  <option value="flexible" className="bg-gray-800">Flexible timeline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Communication Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {communicationMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => handleArrayToggle('communication_preferences', method)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.communication_preferences.includes(method)
                          ? 'border-green-500 bg-green-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Brand voice & style preferences</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Brand Voice & Tone</label>
                <textarea
                  value={formData.brand_voice}
                  onChange={(e) => handleInputChange('brand_voice', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Describe the brand's personality, tone, and voice (e.g., professional, friendly, modern, luxury, etc.)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Target Audience</label>
                <textarea
                  value={formData.target_audience}
                  onChange={(e) => handleInputChange('target_audience', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Who is their target audience? Demographics, interests, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">Style Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {stylePreferences.map(style => (
                    <button
                      key={style}
                      onClick={() => handleArrayToggle('style_preferences', style)}
                      className={`p-3 rounded-xl border-2 transition-all text-sm ${
                        formData.style_preferences.includes(style)
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Brand Guidelines</label>
                <textarea
                  value={formData.brand_guidelines}
                  onChange={(e) => handleInputChange('brand_guidelines', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Any specific brand guidelines, colors, fonts, do's and don'ts, etc."
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Contact details & location</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="" className="bg-gray-800">Select timezone</option>
                  <option value="EST" className="bg-gray-800">Eastern Time (EST)</option>
                  <option value="CST" className="bg-gray-800">Central Time (CST)</option>
                  <option value="MST" className="bg-gray-800">Mountain Time (MST)</option>
                  <option value="PST" className="bg-gray-800">Pacific Time (PST)</option>
                </select>
              </div>

              <div>
                <h4 className="text-lg font-medium text-white mb-4">Social Media Accounts</h4>
                <div className="space-y-4">
                  {Object.entries(formData.social_media).map(([platform, value]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-white mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => handleSocialMediaChange(platform as keyof ClientOnboardingData['social_media'], e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        placeholder={`https://${platform}.com/username`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Final details</h3>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">How did they find us?</label>
                <select
                  value={formData.how_they_found_us}
                  onChange={(e) => handleInputChange('how_they_found_us', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="" className="bg-gray-800">Select source</option>
                  <option value="google_search" className="bg-gray-800">Google Search</option>
                  <option value="social_media" className="bg-gray-800">Social Media</option>
                  <option value="referral" className="bg-gray-800">Referral</option>
                  <option value="website" className="bg-gray-800">Website</option>
                  <option value="advertising" className="bg-gray-800">Advertising</option>
                  <option value="word_of_mouth" className="bg-gray-800">Word of Mouth</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Special Requirements</label>
                <textarea
                  value={formData.special_requirements}
                  onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Any special requirements, accessibility needs, or important considerations"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Any additional notes or information about this client"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-white/10">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Previous
          </button>

          <div className="text-gray-400 text-sm">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep === totalSteps ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all"
            >
              Complete Onboarding
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}