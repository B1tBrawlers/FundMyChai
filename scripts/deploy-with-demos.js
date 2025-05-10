require('dotenv').config();
const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Deploy the contract
  const SimpleFund = await ethers.getContractFactory('SimpleFund');
  const simpleFund = await SimpleFund.deploy();
  await simpleFund.waitForDeployment();

  const contractAddress = await simpleFund.getAddress();
  console.log(`SimpleFund deployed to: ${contractAddress}`);

  // Update .env file with contract address
  const envFilePath = path.join(__dirname, '..', '.env');
  let envFileContent = fs.readFileSync(envFilePath, 'utf8');
  envFileContent = envFileContent.replace(
    /NEXT_PUBLIC_CONTRACT_ADDRESS=".*"/,
    `NEXT_PUBLIC_CONTRACT_ADDRESS="${contractAddress}"`
  );
  fs.writeFileSync(envFilePath, envFileContent);

  console.log(`Updated .env file with contract address: ${contractAddress}`);
  
  // Create demo projects
  console.log("Creating demo projects...");
  
  // Convert ETH to Wei
  const oneEth = ethers.parseEther("1.0");
  const twoEth = ethers.parseEther("2.0");
  const threeEth = ethers.parseEther("3.0");
  
  // Set deadline to 30 days from now
  const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  
  // Create 3 demo projects
  await simpleFund.createProject(
    "Open Source Dev Tool", 
    "A development toolkit designed to help developers contribute to open source projects more efficiently. Includes code analyzers, automated PR templates, and contribution guides.",
    oneEth,
    deadline
  );
  console.log("Project 1 created");
  
  await simpleFund.createProject(
    "Community Garden", 
    "Funding for a new community garden in the downtown area. The goal is to create a sustainable green space for local residents to grow their own vegetables and connect with nature.",
    twoEth,
    deadline
  );
  console.log("Project 2 created");
  
  await simpleFund.createProject(
    "Educational Platform", 
    "An online educational platform teaching blockchain development to beginners. The course will cover fundamentals of Web3, smart contracts, and decentralized application development.",
    threeEth,
    deadline
  );
  console.log("Project 3 created");
  
  console.log("All demo projects created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
