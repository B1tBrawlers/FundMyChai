'use client';

import { useState, useEffect } from 'react';
import { claimRefund, getContribution } from '@/utils/contractInteraction';

export default function RefundClaimer({ projectId, userAddress, goalReached, isDeadlinePassed, onRefundClaimed }) {
  const [contribution, setContribution] = useState('0');
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (userAddress) {
      loadContribution();
    }
  }, [projectId, userAddress]);
  
  const loadContribution = async () => {
    try {
      const amount = await getContribution(projectId, userAddress);
      setContribution(amount);
    } catch (error) {
      console.error("Error loading contribution:", error);
    }
  };
  
  const handleClaimRefund = async () => {
    try {
      setError('');
      setIsClaiming(true);
      
      await claimRefund(projectId);
      
      if (onRefundClaimed) onRefundClaimed();
      
    } catch (error) {
      console.error("Refund claim error:", error);
      setError(error.message || 'An error occurred while claiming refund');
    } finally {
      setIsClaiming(false);
    }
  };
  
  const canClaimRefund = 
    userAddress && 
    isDeadlinePassed && 
    !goalReached && 
    parseFloat(contribution) > 0;
  
  if (!canClaimRefund) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Claim Refund</h3>
      
      <div className="mb-4">
        <p className="text-gray-600">
          The project did not reach its funding goal. You can claim a refund of your contribution.
        </p>
        <p className="mt-2 font-medium">
          Your contribution: {parseFloat(contribution).toFixed(4)} ETH
        </p>
      </div>
      
      {error && (
        <div className="mb-4 text-sm text-red-500">
          {error}
        </div>
      )}
      
      <button
        onClick={handleClaimRefund}
        disabled={isClaiming}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isClaiming ? 'Processing...' : 'Claim Refund'}
      </button>
    </div>
  );
}
