import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  client_name: string;
  type: string;
  status: 'planning' | 'active' | 'review' | 'completed' | 'on_hold';
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  team_members: string[];
  next_milestone: string;
  tasks_completed: number;
  tasks_total: number;
  files_count: number;
  recent_activity: Activity[];
}

interface Activity {
  id: string;
  type: 'task_completed' | 'file_uploaded' | 'comment_added' | 'milestone_reached' | 'payment_received';
  description: string;
  user: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'upcoming' | 'current' | 'completed' | 'overdue';
  tasks: number;
  completion_percentage: number;
}

const ProjectDashboard: React.FC = () => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [view, setView] = useState<'overview' | 'timeline' | 'tasks' | 'files' | 'collaboration'>('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveProject({
        id: '1',
        name: 'Smith Wedding Photography',
        description: 'Elegant wedding photography for John & Jane Smith',
        client_name: 'John & Jane Smith',
        type: 'Wedding Photography',
        status: 'active',
        start_date: '2024-02-01',
        end_date: '2024-02-28',
        budget: 25600,
        currency: 'USD',
        progress: 65,
        priority: 'high',
        team_members: ['Lead Photographer', 'Second Photographer', 'Photo Editor'],
        next_milestone: 'Engagement Shoot',
        tasks_completed: 8,
        tasks_total: 12,
        files_count: 45,
        recent_activity: [
          {
            id: '1',
            type: 'task_completed',
            description: 'Completed venue scouting',
            user: 'John Photographer',
            timestamp: '2 hours ago'
          },
          {
            id: '2',
            type: 'file_uploaded',
            description: 'Uploaded contract documents',
            user: 'Sarah Assistant',
            timestamp: '5 hours ago'
          }
        ]
      });

      setTasks([
        {
          id: '1',
          title: 'Venue Scouting',
          description: 'Scout the wedding venue for photo opportunities',
          assignee: 'Lead Photographer',
          due_date: '2024-02-10',
          status: 'completed',
          priority: 'high',
          category: 'Planning'
        }
      ]);

      setMilestones([
        {
          id: '1',
          title: 'Initial Planning',
          description: 'Contract signing and initial planning phase',
          due_date: '2024-02-05',
          status: 'completed',
          tasks: 5,
          completion_percentage: 100
        }
      ]);

      setIsLoading(false);
    };

    loadProjectData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': case 'current': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-white mb-2">No Active Project</h3>
        <p className="text-gray-400">Select a project to view its dashboard</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{activeProject.name}</h2>
            <p className="text-gray-400 mb-4">{activeProject.description}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(activeProject.status)}`}>
                {activeProject.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(activeProject.priority)}`}>
                {activeProject.priority.toUpperCase()} PRIORITY
              </span>
            </div>
          </div>
          <div className="mt-6 lg:mt-0">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{activeProject.progress}%</div>
              <div className="text-gray-400 text-sm">Complete</div>
              <div className="w-48 bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${activeProject.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">${activeProject.budget.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{activeProject.tasks_completed}/{activeProject.tasks_total}</div>
            <div className="text-gray-400 text-sm">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{activeProject.files_count}</div>
            <div className="text-gray-400 text-sm">Files</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{activeProject.team_members.length}</div>
            <div className="text-gray-400 text-sm">Team Members</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activeProject.recent_activity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.type)}`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.description}</p>
                  <p className="text-gray-400 text-xs">{activity.user} - {activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Next Milestone</h3>
          <div className="text-center">
            <div className="text-xl font-semibold text-white mb-2">{activeProject.next_milestone}</div>
            <div className="text-gray-400 text-sm mb-4">Due in 5 days</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="text-gray-400 text-xs mt-2">75% Complete</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="border-b border-white/10">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setView('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                view === 'overview'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              }`}
            >
              Overview
            </button>
          </nav>
        </div>
      </div>

      <div>
        {view === 'overview' && renderOverview()}
      </div>
    </div>
  );
};

export default ProjectDashboard;
