'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { connectWallet, getProjects } from '@/utils/contractInteraction';

export default function RouteDebugger() {
  const router = useRouter();
  const [routes, setRoutes] = useState([
    { path: '/', name: 'Home' },
    { path: '/create', name: 'Create Project' },
    { path: '/project/0', name: 'Project #0 Detail' },
    { path: '/deploy', name: 'Deploy to Vercel' }
  ]);
  const [contractConnected, setContractConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const testContractConnection = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Try to connect wallet
      await connectWallet();
      
      // Try to fetch projects
      const projects = await getProjects();
      console.log('Projects fetched:', projects);
      
      // If we get here, the contract is connected
      setContractConnected(true);
      setContractAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'Not found in .env');
      
    } catch (error: any) {
      console.error('Contract connection error:', error);
      setError(error.message || 'Failed to connect to contract');
      setContractConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Route Debugger</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
          
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route.path} className="flex items-center justify-between border-b pb-3 last:border-0">
                <span className="text-gray-700">{route.name}</span>
                <div>
                  <Link 
                    href={route.path}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Navigate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contract Connection Test</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Test Contract Connection</span>
              <button
                onClick={testContractConnection}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            
            {contractConnected && (
              <div className="p-4 bg-green-100 rounded border border-green-200">
                <p className="text-green-800 font-medium">Contract Connected Successfully!</p>
                <p className="text-sm mt-2">Contract Address: {contractAddress}</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-100 rounded border border-red-200">
                <p className="text-red-800 font-medium">Connection Error</p>
                <p className="text-sm mt-2">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
