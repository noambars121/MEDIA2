import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  client_name: string;
  type: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date: string;
  end_date: string;
  budget: number;
  progress: number;
  team_members: string[];
  tags: string[];
  last_activity: string;
}

interface WorkflowStage {
  id: string;
  title: string;
  description: string;
  color: string;
  projects: Project[];
  limits?: number;
}

const ProjectWorkflowManager: React.FC = () => {
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadWorkflowData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'Smith Wedding Photography',
          client_name: 'John & Jane Smith',
          type: 'Wedding',
          status: 'active',
          priority: 'high',
          start_date: '2024-02-01',
          end_date: '2024-02-28',
          budget: 25600,
          progress: 65,
          team_members: ['Lead Photographer', 'Assistant'],
          tags: ['Wedding', 'Premium', 'Outdoor'],
          last_activity: '2 hours ago'
        },
        {
          id: '2',
          name: 'Corporate Headshots - TechCorp',
          client_name: 'TechCorp Inc.',
          type: 'Corporate',
          status: 'planning',
          priority: 'medium',
          start_date: '2024-02-15',
          end_date: '2024-02-20',
          budget: 8500,
          progress: 25,
          team_members: ['Lead Photographer'],
          tags: ['Corporate', 'Headshots', 'Studio'],
          last_activity: '1 day ago'
        },
        {
          id: '3',
          name: 'Product Photography - Fashion Brand',
          client_name: 'Style Studio',
          type: 'Product',
          status: 'review',
          priority: 'high',
          start_date: '2024-01-20',
          end_date: '2024-02-10',
          budget: 15000,
          progress: 90,
          team_members: ['Lead Photographer', 'Photo Editor'],
          tags: ['Product', 'Fashion', 'E-commerce'],
          last_activity: '3 hours ago'
        },
        {
          id: '4',
          name: 'Real Estate Portfolio',
          client_name: 'Premium Properties',
          type: 'Real Estate',
          status: 'completed',
          priority: 'low',
          start_date: '2024-01-10',
          end_date: '2024-01-25',
          budget: 5500,
          progress: 100,
          team_members: ['Lead Photographer'],
          tags: ['Real Estate', 'Architecture'],
          last_activity: '2 days ago'
        }
      ];

      const workflowStages: WorkflowStage[] = [
        {
          id: 'planning',
          title: 'Planning & Setup',
          description: 'Initial project setup and planning phase',
          color: 'bg-blue-500',
          projects: mockProjects.filter(p => p.status === 'planning'),
          limits: 5
        },
        {
          id: 'active',
          title: 'In Progress',
          description: 'Active projects currently being worked on',
          color: 'bg-yellow-500',
          projects: mockProjects.filter(p => p.status === 'active'),
          limits: 3
        },
        {
          id: 'review',
          title: 'Review & Approval',
          description: 'Projects pending client review and approval',
          color: 'bg-orange-500',
          projects: mockProjects.filter(p => p.status === 'review'),
          limits: 4
        },
        {
          id: 'completed',
          title: 'Completed',
          description: 'Successfully completed and delivered projects',
          color: 'bg-green-500',
          projects: mockProjects.filter(p => p.status === 'completed')
        }
      ];

      setStages(workflowStages);
      setIsLoading(false);
    };

    loadWorkflowData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    if (!draggedProject) return;

    // Update project status
    const updatedStages = stages.map(stage => ({
      ...stage,
      projects: stage.projects.filter(p => p.id !== draggedProject.id)
    }));

    const targetStage = updatedStages.find(s => s.id === targetStageId);
    if (targetStage) {
      const updatedProject = { ...draggedProject, status: targetStageId as any };
      targetStage.projects.push(updatedProject);
    }

    setStages(updatedStages);
    setDraggedProject(null);
  };

  const filteredStages = stages.map(stage => ({
    ...stage,
    projects: stage.projects.filter(project => {
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesSearch;
    })
  }));

  const totalProjects = stages.reduce((sum, stage) => sum + stage.projects.length, 0);
  const activeProjects = stages.find(s => s.id === 'active')?.projects.length || 0;
  const completedProjects = stages.find(s => s.id === 'completed')?.projects.length || 0;
  const totalValue = stages.reduce((sum, stage) => 
    sum + stage.projects.reduce((stageSum, project) => stageSum + project.budget, 0), 0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Project Workflow</h1>
        <p className="text-gray-400">Manage your projects through their entire lifecycle</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">{totalProjects}</div>
          <div className="text-gray-400 text-sm">Total Projects</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-2xl font-bold text-yellow-400">{activeProjects}</div>
          <div className="text-gray-400 text-sm">Active Projects</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{completedProjects}</div>
          <div className="text-gray-400 text-sm">Completed</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Value</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-auto">
        {filteredStages.map(stage => (
          <div
            key={stage.id}
            className="bg-white/5 rounded-xl border border-white/10 min-h-96"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-semibold text-white">{stage.title}</h3>
                </div>
                <span className="bg-white/10 px-2 py-1 rounded-full text-xs text-gray-300">
                  {stage.projects.length}
                  {stage.limits && `/${stage.limits}`}
                </span>
              </div>
              <p className="text-gray-400 text-xs">{stage.description}</p>
            </div>

            {/* Projects */}
            <div className="p-4 space-y-4">
              {stage.projects.map(project => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(project)}
                  onClick={() => setSelectedProject(project)}
                  className={`bg-white/5 rounded-lg p-4 border-l-4 ${getPriorityColor(project.priority)} cursor-pointer hover:bg-white/10 transition-colors`}
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-white text-sm mb-1">{project.name}</h4>
                    <p className="text-gray-400 text-xs">{project.client_name}</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                      {project.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs text-gray-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${stage.color}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs bg-blue-600/20 text-blue-300 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span className="text-xs text-gray-400">+{project.tags.length - 2}</span>
                    )}
                  </div>

                  {/* Team Members */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {project.team_members.slice(0, 3).map((member, index) => (
                        <div key={index} className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border border-gray-700">
                          <span className="text-xs text-white">{member.charAt(0)}</span>
                        </div>
                      ))}
                      {project.team_members.length > 3 && (
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border border-gray-700">
                          <span className="text-xs text-white">+{project.team_members.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{project.last_activity}</span>
                  </div>
                </div>
              ))}

              {/* Add Project to Stage */}
              <button className="w-full p-3 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:border-white/40 hover:text-white transition-colors">
                + Add Project
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full mx-4 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                  <p className="text-white">{selectedProject.client_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <p className="text-white">{selectedProject.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                  <p className="text-white">${selectedProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <p className="text-white capitalize">{selectedProject.priority}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <p className="text-white">{selectedProject.start_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <p className="text-white">{selectedProject.end_date}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Progress</label>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-1">{selectedProject.progress}% Complete</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Members</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team_members.map((member, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-gray-300 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Open Project
                </button>
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWorkflowManager; 