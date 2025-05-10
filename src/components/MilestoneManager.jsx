'use client';

import { useState } from 'react';
import { approveMilestone } from '@/utils/contractInteraction';

export default function MilestoneManager({ projectId, milestones, isCreator, onMilestoneApproved }) {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState('');
  
  const handleApproveMilestone = async (milestoneIndex) => {
    try {
      setError('');
      setIsApproving(true);
      
      await approveMilestone(projectId, milestoneIndex);
      
      if (onMilestoneApproved) onMilestoneApproved();
      
    } catch (error) {
      console.error("Milestone approval error:", error);
      setError(error.message || 'An error occurred while approving milestone');
    } finally {
      setIsApproving(false);
    }
  };

  const milestoneNames = ["Initial Research", "Development", "Final Delivery"];
  const milestonePercentages = ["25%", "50%", "25%"];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Project Milestones</h3>
      
      {error && (
        <div className="mb-4 text-sm text-red-500">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {milestones.map((approved, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
            <div>
              <div className="font-medium">{milestoneNames[index]}</div>
              <div className="text-sm text-gray-500">{milestonePercentages[index]} of funds</div>
            </div>
            
            <div>
              {approved ? (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Approved
                </span>
              ) : isCreator ? (
                <button
                  onClick={() => handleApproveMilestone(index)}
                  disabled={isApproving || (index > 0 && !milestones[index - 1])}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index > 0 && !milestones[index - 1] 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  {isApproving ? 'Processing...' : 'Approve'}
                </button>
              ) : (
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
