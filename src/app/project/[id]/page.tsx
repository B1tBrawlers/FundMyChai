'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ContributeForm from '@/components/ContributeForm';
import MilestoneManager from '@/components/MilestoneManager';
import RefundClaimer from '@/components/RefundClaimer';
import { getProjects, calculateFundingProgress, truncateAddress } from '@/utils/contractInteraction';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const projectId = parseInt(params.id);
  
  useEffect(() => {
    loadProject();
    
    // Get user address from localStorage if available
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setUserAddress(storedAddress);
    }
  }, [projectId]);
  
  const loadProject = async () => {
    try {
      setLoading(true);
      const projects = await getProjects();
      const foundProject = projects.find((p: any) => p.id === projectId);
      
      if (!foundProject) {
        throw new Error('Project not found');
      }
      
      setProject(foundProject);
    } catch (error: any) {
      console.error("Error loading project:", error);
      setError(error.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleProjectUpdate = () => {
    loadProject();
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </>
    );
  }
  
  if (error || !project) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error || 'Project not found'}
          </div>
          <div className="mt-6">
            <Link href="/">
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  const progress = calculateFundingProgress(project.totalFunds, project.goal);
  const isDeadlinePassed = new Date() > project.deadline;
  const goalReached = parseFloat(project.totalFunds) >= parseFloat(project.goal);
  const isCreator = userAddress.toLowerCase() === project.creator.toLowerCase();
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center text-purple-600 hover:text-purple-700">
              <span className="mr-1">←</span> Back to All Projects
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <p className="text-gray-500 mb-4">by {truncateAddress(project.creator)}</p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.isClosed ? 'bg-blue-100 text-blue-800' :
                  isDeadlinePassed ? 'bg-red-100 text-red-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {project.isClosed ? 'Completed' : 
                   isDeadlinePassed ? 'Ended' : 'Active'}
                </div>
              </div>
            </div>
            
            <div className="my-6">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-purple-600 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">{project.totalFunds} ETH raised</span>
                <span className="text-gray-600">Goal: {project.goal} ETH</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                {isDeadlinePassed ? (
                  <span>Ended on {project.deadline.toLocaleDateString()}</span>
                ) : (
                  <span>Ends on {project.deadline.toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex space-x-2">
                {project.milestones.map((approved: boolean, index: number) => (
                  <div 
                    key={index} 
                    className={`w-3 h-3 rounded-full ${approved ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={`Milestone ${index + 1}`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">About this project</h3>
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MilestoneManager 
              projectId={projectId} 
              milestones={project.milestones} 
              isCreator={isCreator}
              onMilestoneApproved={handleProjectUpdate}
            />
          </div>
          <div>
            {!project.isClosed && !isDeadlinePassed && (
              <ContributeForm 
                projectId={projectId}
                onContribute={handleProjectUpdate}
              />
            )}
            
            <RefundClaimer 
              projectId={projectId}
              userAddress={userAddress}
              goalReached={goalReached}
              isDeadlinePassed={isDeadlinePassed}
              onRefundClaimed={handleProjectUpdate}
            />
          </div>
        </div>
      </main>
    </>
  );
}
