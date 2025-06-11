import React, { useState } from 'react';

interface ProjectData {
  // Step 1: Basic Info
  name: string;
  description: string;
  client_id: string;
  type: string;
  category: string;
  
  // Step 2: Timeline & Budget
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  payment_terms: string;
  
  // Step 3: Services & Deliverables
  services: string[];
  deliverables: Array<{
    name: string;
    description: string;
    due_date: string;
    format: string;
  }>;
  
  // Step 4: Team & Resources
  team_members: string[];
  equipment_needed: string[];
  location: string;
  venue_details: string;
  
  // Step 5: Client Requirements
  style_preferences: string[];
  special_requests: string;
  technical_requirements: string;
  reference_materials: string[];
  
  // Step 6: Communication & Workflow
  communication_preferences: string[];
  review_process: string;
  approval_workflow: string;
  milestone_notifications: boolean;
  
  // Step 7: Final Details
  contract_terms: string;
  cancellation_policy: string;
  additional_notes: string;
  project_priority: string;
}

const ProjectCreationWizard: React.FC = (): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    client_id: '',
    type: '',
    category: '',
    start_date: '',
    end_date: '',
    budget: 0,
    currency: 'USD',
    payment_terms: '',
    services: [],
    deliverables: [],
    team_members: [],
    equipment_needed: [],
    location: '',
    venue_details: '',
    style_preferences: [],
    special_requests: '',
    technical_requirements: '',
    reference_materials: [],
    communication_preferences: [],
    review_process: '',
    approval_workflow: '',
    milestone_notifications: true,
    contract_terms: '',
    cancellation_policy: '',
    additional_notes: '',
    project_priority: 'medium'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const projectTypes = [
    'Wedding Photography', 'Corporate Events', 'Portrait Sessions',
    'Product Photography', 'Real Estate', 'Fashion Shoots',
    'Documentary', 'Commercial Video', 'Social Media Content'
  ];

  const serviceOptions = [
    'Photography', 'Videography', 'Photo Editing', 'Video Editing',
    'Drone Photography', 'Live Streaming', 'Photo Booth', 'Album Design',
    'Digital Gallery', 'Print Services', 'Social Media Content', 'SEO Services'
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Project details and client selection', icon: '🎯' },
    { number: 2, title: 'Timeline', description: 'Scheduling and financial planning', icon: '📅' },
    { number: 3, title: 'Services', description: 'What will be delivered', icon: '🎨' },
    { number: 4, title: 'Resources', description: 'Equipment and personnel', icon: '🛠️' },
    { number: 5, title: 'Requirements', description: 'Style and special requests', icon: '✨' },
    { number: 6, title: 'Workflow', description: 'Communication and process', icon: '🔄' },
    { number: 7, title: 'Finalize', description: 'Contracts and final details', icon: '🎉' }
  ];

  const updateData = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addDeliverable = () => {
    setProjectData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, {
        name: '',
        description: '',
        due_date: '',
        format: ''
      }]
    }));
  };

  const updateDeliverable = (index: number, field: string, value: string) => {
    setProjectData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeDeliverable = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const toggleArrayItem = (field: keyof ProjectData, item: string) => {
    setProjectData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!projectData.name) newErrors.name = 'Project name is required';
        if (!projectData.client_id) newErrors.client_id = 'Client selection is required';
        if (!projectData.type) newErrors.type = 'Project type is required';
        break;
      case 2:
        if (!projectData.start_date) newErrors.start_date = 'Start date is required';
        if (!projectData.end_date) newErrors.end_date = 'End date is required';
        if (!projectData.budget) newErrors.budget = 'Budget is required';
        break;
      case 3:
        if (projectData.services.length === 0) newErrors.services = 'At least one service must be selected';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Here you would integrate with your backend API
      console.log('Creating project:', projectData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Project created successfully!');
      // Reset form or redirect
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={projectData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                      errors.name ? 'border-red-400 ring-2 ring-red-400' : ''
                    }`}
                    placeholder="Enter project name..."
                  />
                  {errors.name && <p className="text-red-300 text-sm mt-2 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Description
                  </label>
                  <textarea
                    value={projectData.description}
                    onChange={(e) => updateData('description', e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe the project scope and goals..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Client *
                  </label>
                  <select
                    value={projectData.client_id}
                    onChange={(e) => updateData('client_id', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                      errors.client_id ? 'border-red-400 ring-2 ring-red-400' : ''
                    }`}
                  >
                    <option value="" className="bg-gray-900">Select a client...</option>
                    <option value="1" className="bg-gray-900">John Smith</option>
                    <option value="2" className="bg-gray-900">Sarah Johnson</option>
                    <option value="3" className="bg-gray-900">Microsoft Corp</option>
                    <option value="4" className="bg-gray-900">Local Restaurant</option>
                  </select>
                  {errors.client_id && <p className="text-red-300 text-sm mt-2 font-medium">{errors.client_id}</p>}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Project Type *
                  </label>
                  <select
                    value={projectData.type}
                    onChange={(e) => updateData('type', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                      errors.type ? 'border-red-400 ring-2 ring-red-400' : ''
                    }`}
                  >
                    <option value="" className="bg-gray-900">Select type...</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-900">{type}</option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-300 text-sm mt-2 font-medium">{errors.type}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Category
                  </label>
                  <select
                    value={projectData.category}
                    onChange={(e) => updateData('category', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-gray-900">Select category...</option>
                    <option value="photography" className="bg-gray-900">Photography</option>
                    <option value="videography" className="bg-gray-900">Videography</option>
                    <option value="hybrid" className="bg-gray-900">Photography + Video</option>
                    <option value="content" className="bg-gray-900">Content Creation</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-3">Quick Start Tips</h3>
                  <ul className="text-gray-200 text-sm space-y-2">
                    <li>• Choose a clear, descriptive project name</li>
                    <li>• Select the client from your existing contacts</li>
                    <li>• Pick the most relevant project type</li>
                    <li>• Add a detailed description for clarity</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={projectData.start_date}
                    onChange={(e) => updateData('start_date', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                      errors.start_date ? 'border-red-400 ring-2 ring-red-400' : ''
                    }`}
                  />
                  {errors.start_date && <p className="text-red-300 text-sm mt-2 font-medium">{errors.start_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={projectData.end_date}
                    onChange={(e) => updateData('end_date', e.target.value)}
                    className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ${
                      errors.end_date ? 'border-red-400 ring-2 ring-red-400' : ''
                    }`}
                  />
                  {errors.end_date && <p className="text-red-300 text-sm mt-2 font-medium">{errors.end_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Payment Terms
                  </label>
                  <select
                    value={projectData.payment_terms}
                    onChange={(e) => updateData('payment_terms', e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-gray-900">Select payment terms...</option>
                    <option value="50_50" className="bg-gray-900">50% upfront, 50% on completion</option>
                    <option value="30_70" className="bg-gray-900">30% upfront, 70% on completion</option>
                    <option value="full_upfront" className="bg-gray-900">100% upfront</option>
                    <option value="net_30" className="bg-gray-900">Net 30 days</option>
                    <option value="installments" className="bg-gray-900">Monthly installments</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-3">
                    Budget *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => updateData('budget', parseFloat(e.target.value))}
                      className={`w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-20 ${
                        errors.budget ? 'border-red-400 ring-2 ring-red-400' : ''
                      }`}
                      placeholder="Enter budget amount"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <select
                        value={projectData.currency}
                        onChange={(e) => updateData('currency', e.target.value)}
                        className="bg-transparent text-white border-none focus:outline-none cursor-pointer"
                      >
                        <option value="USD" className="bg-gray-900">USD</option>
                        <option value="EUR" className="bg-gray-900">EUR</option>
                        <option value="GBP" className="bg-gray-900">GBP</option>
                        <option value="CAD" className="bg-gray-900">CAD</option>
                      </select>
                    </div>
                  </div>
                  {errors.budget && <p className="text-red-300 text-sm mt-2 font-medium">{errors.budget}</p>}
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <span className="mr-2">💰</span>
                    Budget Planning
                  </h3>
                  <div className="space-y-2 text-gray-200 text-sm">
                    <p>• Factor in equipment, time, and editing costs</p>
                    <p>• Consider travel expenses if applicable</p>
                    <p>• Add 10-15% buffer for unexpected expenses</p>
                    <p>• Review similar projects for reference pricing</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <span className="mr-2">⏰</span>
                    Timeline Tips
                  </h3>
                  <div className="space-y-2 text-gray-200 text-sm">
                    <p>• Include buffer time for revisions</p>
                    <p>• Consider client approval timelines</p>
                    <p>• Account for post-production time</p>
                    <p>• Plan for delivery and client feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-white mb-6">
                Services Included *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {serviceOptions.map(service => (
                  <label key={service} className="group relative overflow-hidden">
                    <input
                      type="checkbox"
                      checked={projectData.services.includes(service)}
                      onChange={() => toggleArrayItem('services', service)}
                      className="sr-only"
                    />
                    <div className={`p-4 bg-white/10 backdrop-blur-md border-2 rounded-2xl cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 ${
                      projectData.services.includes(service)
                        ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/50'
                        : 'border-white/20 hover:border-white/40'
                    }`}>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-3 transition-all duration-300 ${
                          projectData.services.includes(service) ? 'bg-blue-400' : 'bg-gray-500'
                        }`}></div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          projectData.services.includes(service) ? 'text-white' : 'text-gray-300'
                        }`}>
                          {service}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.services && <p className="text-red-300 text-sm mt-4 font-medium">{errors.services}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <label className="block text-lg font-bold text-white">
                  Deliverables
                </label>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                >
                  + Add Deliverable
                </button>
              </div>

              <div className="space-y-6">
                {projectData.deliverables.map((deliverable, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold flex items-center">
                        <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        Deliverable {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDeliverable(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 hover:bg-red-500/20 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={deliverable.name}
                        onChange={(e) => updateDeliverable(index, 'name', e.target.value)}
                        placeholder="Deliverable name"
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                      />
                      <input
                        type="date"
                        value={deliverable.due_date}
                        onChange={(e) => updateDeliverable(index, 'due_date', e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                      />
                      <input
                        type="text"
                        value={deliverable.description}
                        onChange={(e) => updateDeliverable(index, 'description', e.target.value)}
                        placeholder="Description"
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                      />
                      <select
                        value={deliverable.format}
                        onChange={(e) => updateDeliverable(index, 'format', e.target.value)}
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                      >
                        <option value="" className="bg-gray-900">Select format...</option>
                        <option value="digital" className="bg-gray-900">Digital Files</option>
                        <option value="print" className="bg-gray-900">Print Ready</option>
                        <option value="video" className="bg-gray-900">Video Files</option>
                        <option value="album" className="bg-gray-900">Photo Album</option>
                        <option value="gallery" className="bg-gray-900">Online Gallery</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                {projectData.deliverables.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-2xl">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Deliverables Added</h3>
                    <p className="text-gray-400 mb-4">Add deliverables to define what will be provided to the client</p>
                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                    >
                      Add First Deliverable
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-white mb-4">Step {currentStep} Coming Soon</h3>
            <p className="text-gray-400 text-lg">This step is under development and will be available soon.</p>
            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto">
              <h4 className="text-white font-semibold mb-3">What's Coming:</h4>
              <ul className="text-gray-300 text-sm space-y-2 text-left">
                <li>• Team member assignment</li>
                <li>• Equipment planning</li>
                <li>• Client requirements capture</li>
                <li>• Communication workflows</li>
                <li>• Contract finalization</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Create New Project
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Set up a comprehensive project with all necessary details for your client
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center relative">
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-12 w-20 h-0.5 transition-all duration-500 ${
                    currentStep > step.number ? 'bg-blue-400' : 'bg-white/20'
                  }`}></div>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 mb-3 relative z-10 ${
                  currentStep >= step.number 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg shadow-blue-500/25' 
                    : 'border-white/30 text-gray-400 bg-white/5 backdrop-blur-md'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-2xl">{step.icon}</span>
                  )}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-semibold transition-colors duration-300 ${
                    currentStep >= step.number ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 max-w-20 hidden lg:block mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{steps[currentStep - 1].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {steps[currentStep - 1].title}
                </h2>
                <p className="text-gray-300">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/10 flex items-center space-x-2"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Previous</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Step {currentStep} of {steps.length}</div>
            <div className="w-48 bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 7 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-green-500/25 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Project...</span>
                </>
              ) : (
                <>
                  <span>Create Project</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <span>Next</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCreationWizard;
