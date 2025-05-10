const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleFund contract...");

  const SimpleFund = await hre.ethers.getContractFactory("SimpleFund");
  const simpleFund = await SimpleFund.deploy();

  await simpleFund.waitForDeployment();
  
  const address = await simpleFund.getAddress();
  console.log(`SimpleFund deployed to: ${address}`);
  
  // For demo purposes, let's add some sample projects
  const oneEth = hre.ethers.parseEther("1");
  const twoEth = hre.ethers.parseEther("2");
  const threeEth = hre.ethers.parseEther("3");
  
  // Set deadline to 30 days from now
  const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  
  console.log("Creating sample projects...");
  
  await simpleFund.createProject(
    "Open Source Dev Tool", 
    "A set of development tools for open source contributors.",
    oneEth,
    deadline
  );
  
  await simpleFund.createProject(
    "Community Garden", 
    "Funding for a new community garden in the neighborhood.",
    twoEth,
    deadline
  );
  
  await simpleFund.createProject(
    "Educational Platform", 
    "An educational platform teaching blockchain development.",
    threeEth,
    deadline
  );
  
  console.log("Sample projects created successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
