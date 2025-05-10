// scripts/deploy-sepolia.js
require('dotenv').config();
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying SimpleFund contract to Sepolia testnet...");

  // Deploy the contract
  const SimpleFund = await hre.ethers.getContractFactory("SimpleFund");
  const simpleFund = await SimpleFund.deploy();
  
  await simpleFund.waitForDeployment();
  
  const contractAddress = await simpleFund.getAddress();
  console.log(`SimpleFund deployed to: ${contractAddress}`);
  
  // Update .env file with contract address
  try {
    const envFilePath = path.join(__dirname, '..', '.env');
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');
    
    // Replace or add the contract address
    if (envFileContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
      envFileContent = envFileContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envFileContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
    }
    
    // Update the network to sepolia
    if (envFileContent.includes('NEXT_PUBLIC_NETWORK=')) {
      envFileContent = envFileContent.replace(
        /NEXT_PUBLIC_NETWORK=.*/,
        'NEXT_PUBLIC_NETWORK=sepolia'
      );
    } else {
      envFileContent += '\nNEXT_PUBLIC_NETWORK=sepolia';
    }
    
    fs.writeFileSync(envFilePath, envFileContent);
    console.log("Updated .env file with contract address and network configuration");
  } catch (error) {
    console.error("Failed to update .env file:", error);
    console.log("Please manually update your .env file with:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("NEXT_PUBLIC_NETWORK=sepolia");
  }

  // Create demo projects
  console.log("Creating demo projects on Sepolia...");
    
  const oneDay = 24 * 60 * 60;
  
  // Convert ETH to Wei using ethers v6
  const oneEth = hre.ethers.parseEther("1.0");
  const twoEth = hre.ethers.parseEther("2.0");
  const threeEth = hre.ethers.parseEther("3.0");
  
  // Set deadlines (current time + days)
  const now = Math.floor(Date.now() / 1000);
  const deadline1 = now + (7 * oneDay);
  const deadline2 = now + (14 * oneDay);
  const deadline3 = now + (30 * oneDay);
  
  try {
    // Create demo projects with different deadlines
    console.log("Creating Project 1: Community Garden...");
    const tx1 = await simpleFund.createProject(
      "Community Garden", 
      "Help us build a community garden in the heart of the city. This project will transform an unused urban space into a flourishing green area with vegetables, flowers, and community gathering spaces.",
      oneEth,
      deadline1
    );
    await tx1.wait();
    console.log("Project 1 created!");
    
    console.log("Creating Project 2: Indie Game Development...");
    const tx2 = await simpleFund.createProject(
      "Indie Game Development", 
      "Support our team to create an innovative indie game. We're a small team of passionate developers working on a unique puzzle adventure game with procedurally generated levels and an engaging storyline.",
      twoEth,
      deadline2
    );
    await tx2.wait();
    console.log("Project 2 created!");
    
    console.log("Creating Project 3: Blockchain Workshop Series...");
    const tx3 = await simpleFund.createProject(
      "Blockchain Workshop Series", 
      "Fund a series of workshops teaching blockchain development to beginners. The curriculum covers smart contracts, dApp development, and web3 integration, with hands-on projects and mentorship.",
      threeEth,
      deadline3
    );
    await tx3.wait();
    console.log("Project 3 created!");
    
    console.log("All demo projects created successfully!");
  } catch (error) {
    console.error("Error creating demo projects:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
