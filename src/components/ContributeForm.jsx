'use client';

import { useState } from 'react';
import { contributeToProject } from '@/utils/contractInteraction';

export default function ContributeForm({ projectId, onContribute }) {
  const [amount, setAmount] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setError('');
      setIsContributing(true);
      
      await contributeToProject(projectId, amount);
      
      // Reset form and notify parent component
      setAmount('');
      if (onContribute) onContribute();
      
    } catch (error) {
      console.error("Contribution error:", error);
      setError(error.message || 'An error occurred while contributing');
    } finally {
      setIsContributing(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Support this project</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ETH)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0.1"
          />
        </div>
        
        {error && (
          <div className="mb-4 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isContributing || !amount}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isContributing ? 'Processing...' : 'Contribute'}
        </button>
      </form>
    </div>
  );
}
