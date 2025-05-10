'use client';

import { useState } from 'react';
import { createProject } from '@/utils/contractInteraction';
import { useRouter } from 'next/navigation';

export default function ProjectForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    deadline: 30 // default 30 days
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, description, goal, deadline } = formData;
    
    if (!name || !description || !goal || !deadline) {
      setError('All fields are required');
      return;
    }
    
    if (isNaN(goal) || Number(goal) <= 0) {
      setError('Goal must be a positive number');
      return;
    }
    
    if (isNaN(deadline) || Number(deadline) <= 0) {
      setError('Deadline must be a positive number of days');
      return;
    }
    
    try {
      setError('');
      setIsCreating(true);
      
      await createProject(name, description, goal, deadline);
      
      console.log('Project created successfully!');
      router.push('/'); // Redirect to homepage
      
    } catch (error) {
      console.error("Project creation error:", error);
      setError(error.message || 'An error occurred while creating the project');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="My Awesome Project"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your project..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              Funding Goal (ETH)
            </label>
            <input
              id="goal"
              name="goal"
              type="number"
              step="0.01"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="1.0"
            />
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Deadline (days)
            </label>
            <input
              id="deadline"
              name="deadline"
              type="number"
              min="1"
              max="365"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="30"
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
