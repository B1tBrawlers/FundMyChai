require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.25",
  networks: {
    hardhat: {
      chainId: 1337
    },
    // Sepolia configuration for testnet deployment
    // Make sure to set SEPOLIA_URL and PRIVATE_KEY in your .env file
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 2100000,
      gasPrice: 8000000000
    },
  },
  paths: {
    artifacts: "./src/artifacts",
  },
};
