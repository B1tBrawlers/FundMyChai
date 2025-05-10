'use client';

import Link from 'next/link';
import { calculateFundingProgress, truncateAddress } from '@/utils/contractInteraction';

export default function ProjectCard({ id, name, description, goal, totalFunds, deadline, creator, milestones }) {
  const progress = calculateFundingProgress(totalFunds, goal);
  const isDeadlinePassed = new Date() > deadline;
  const goalReached = parseFloat(totalFunds) >= parseFloat(goal);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-medium">{totalFunds} ETH raised</span>
            <span className="text-gray-600">Goal: {goal} ETH</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <div>By: {truncateAddress(creator)}</div>
          <div>
            {isDeadlinePassed ? (
              <span className="text-red-500">Ended</span>
            ) : (
              <span>Ends: {deadline.toLocaleDateString()}</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {milestones.map((approved, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${approved ? 'bg-green-500' : 'bg-gray-300'}`}
                title={`Milestone ${index + 1}`}
              ></div>
            ))}
          </div>
          <Link href={`/project/${id}`}>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
