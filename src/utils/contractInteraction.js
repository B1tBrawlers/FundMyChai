import { ethers } from 'ethers';
import SimpleFundABI from '@/artifacts/contracts/SimpleFund.sol/SimpleFund.json';

let provider;
let signer;
let contract;

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install it to use this app.");
    }

    console.log("Connecting to wallet...");
    
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name}`);
    
    const address = accounts[0];
    console.log(`Connected wallet address: ${address}`);
    
    // Store address in localStorage for persistence
    localStorage.setItem('walletAddress', address);
    
    // Initialize contract
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.error("Contract address not found in environment variables");
      return null;
    }
    
    contract = new ethers.Contract(
      contractAddress,
      SimpleFundABI.abi,
      signer
    );
    
    console.log("Contract initialized:", contract);
    
    return {
      address,
      signer,
      provider
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

export const getBalance = async (address) => {
  try {
    if (!provider) throw new Error("Provider not initialized");
    
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
};

export const getProjects = async () => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    const projectCount = await contract.projectCount();
    console.log(`Total projects: ${projectCount}`);
    
    const projects = [];
    
    for (let i = 0; i < projectCount; i++) {
      const projectDetails = await contract.getProjectDetails(i);
      
      projects.push({
        id: i,
        creator: projectDetails[0],
        name: projectDetails[1],
        description: projectDetails[2],
        goal: ethers.formatEther(projectDetails[3]),
        totalFunds: ethers.formatEther(projectDetails[4]),
        deadline: new Date(Number(projectDetails[5]) * 1000),
        milestones: projectDetails[6],
        isClosed: projectDetails[7]
      });
    }
    
    console.log("Projects loaded:", projects);
    return projects;
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const createProject = async (name, description, goalInEth, daysToDeadline) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    // Convert ETH to Wei
    const goalInWei = ethers.parseEther(goalInEth.toString());
    
    // Calculate deadline timestamp (current time + days)
    const deadline = Math.floor(Date.now() / 1000) + (daysToDeadline * 24 * 60 * 60);
    
    console.log(`Creating project: ${name} with goal ${goalInEth} ETH and deadline ${daysToDeadline} days`);
    
    const tx = await contract.createProject(name, description, goalInWei, deadline);
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("Project created successfully");
    
    return true;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const contributeToProject = async (projectId, amountInEth) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    // Convert ETH to Wei
    const amountInWei = ethers.parseEther(amountInEth.toString());
    
    console.log(`Contributing ${amountInEth} ETH to project ${projectId}`);
    
    const tx = await contract.contribute(projectId, { value: amountInWei });
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("Contribution successful");
    
    return true;
  } catch (error) {
    console.error("Error contributing to project:", error);
    throw error;
  }
};

export const approveMilestone = async (projectId, milestoneIndex) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    console.log(`Approving milestone ${milestoneIndex} for project ${projectId}`);
    
    const tx = await contract.approveMilestone(projectId, milestoneIndex);
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("Milestone approved successfully");
    
    return true;
  } catch (error) {
    console.error("Error approving milestone:", error);
    throw error;
  }
};

export const claimRefund = async (projectId) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    console.log(`Claiming refund for project ${projectId}`);
    
    const tx = await contract.claimRefund(projectId);
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("Refund claimed successfully");
    
    return true;
  } catch (error) {
    console.error("Error claiming refund:", error);
    throw error;
  }
};

export const truncateAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const calculateFundingProgress = (totalFunds, goal) => {
  const percentage = (parseFloat(totalFunds) / parseFloat(goal)) * 100;
  return Math.min(percentage, 100);
};

export const getContribution = async (projectId, address) => {
  try {
    if (!contract) throw new Error("Contract not initialized");
    
    const contribution = await contract.getContribution(projectId, address);
    return ethers.formatEther(contribution);
  } catch (error) {
    console.error("Error getting contribution:", error);
    throw error;
  }
};
