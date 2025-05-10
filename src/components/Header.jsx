'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { connectWallet, getBalance, truncateAddress } from '@/utils/contractInteraction';

export default function Header() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Check for saved wallet on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setWalletAddress(savedAddress);
      // Get balance for saved address
      const fetchBalance = async () => {
        try {
          const balance = await getBalance(savedAddress);
          setWalletBalance(balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          // If there's an error, the wallet might be disconnected
          localStorage.removeItem('walletAddress');
        }
      };
      fetchBalance();
    }
  }, []);
  
  // Set up event listener for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          setWalletAddress('');
          setWalletBalance('');
          localStorage.removeItem('walletAddress');
        } else {
          // User switched account
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
          getBalance(accounts[0]).then(balance => setWalletBalance(balance));
        }
      });
    }
    
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);
  
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const walletInfo = await connectWallet();
      
      if (walletInfo) {
        setWalletAddress(walletInfo.address);
        const balance = await getBalance(walletInfo.address);
        setWalletBalance(balance);
      }
    } catch (error) {
      console.error("Connect wallet error:", error);
      // Add user-friendly error alert here
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <header className="flex justify-between items-center p-4 bg-purple-700 text-white">
      <Link href="/" className="text-white hover:text-gray-100 flex items-center">
        <h1 className="text-2xl font-bold">FundMyChai</h1>
      </Link>
      
      <div className="flex items-center space-x-4">
        {walletAddress ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm px-4 py-2 bg-purple-800 rounded-lg">
              {walletBalance && (
                <span className="mr-2 font-medium">{Number(walletBalance).toFixed(4)} ETH</span>
              )}
              <span>{truncateAddress(walletAddress)}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  );
}
