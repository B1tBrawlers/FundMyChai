# SimpleFund - Minimal ETH Crowdfunding Dapp

A minimal Ethereum crowdfunding platform with milestone-based funding built with Next.js 14 and Solidity 0.8.25.

## Features

- Create crowdfunding projects with goals and deadlines
- Contribute ETH to projects you want to support
- Milestone-based fund release (25%/50%/25%)
- Refund mechanism if goals aren't met
- MetaMask wallet integration
- Works on local Hardhat network or Sepolia testnet
- Simple, clean UI with Tailwind CSS

## Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity 0.8.25, Hardhat, Ethers.js v6
- **Wallet**: MetaMask integration
- **Network**: Local Hardhat network or Sepolia testnet

## Quick Start

The easiest way to get started is using our quick demo script that sets up everything automatically:

```bash
# Install dependencies and set up environment
./setup.sh

# Run the quick demo with local blockchain
./quick-demo.sh
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Web3**: ethers.js v6, MetaMask
- **Smart Contracts**: Solidity 0.8.25, Hardhat

## Environment Setup

1. Create a `.env` file with the following:

```
SEPOLIA_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
NEXT_PUBLIC_CONTRACT_ADDRESS=""
```

## Manual Setup

If you prefer a manual setup, follow these steps:

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=""
NEXT_PUBLIC_NETWORK=hardhat
SEPOLIA_URL="https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
```

3. Start a local Hardhat network:
```bash
npx hardhat node
```

4. Deploy the contract locally:
```bash
npx hardhat run scripts/deploy-with-demos.js --network localhost
```

5. Copy the contract address from the terminal output to your `.env` file.

6. Start the Next.js development server:
```bash
npm run dev
```

## Contract Deployment to Sepolia

1. Ensure your `.env` file has the correct Sepolia URL and your private key.

2. Uncomment the Sepolia network configuration in `hardhat.config.js`.

3. Deploy the smart contract to Sepolia testnet:
```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

4. Update your `.env` file with:
```
NEXT_PUBLIC_CONTRACT_ADDRESS="YOUR_DEPLOYED_ADDRESS"
NEXT_PUBLIC_NETWORK=sepolia
```

## Smart Contract Architecture

The `SimpleFund.sol` contract implements a milestone-based crowdfunding system:

1. **Project Creation**: Anyone can create a project with a name, description, funding goal, and deadline.

2. **Contributions**: Users can contribute ETH to any open project.

3. **Milestone System**: The project creator can approve milestones to release funds:
   - First milestone (25% of funds)
   - Second milestone (50% of funds)
   - Final milestone (25% of funds and closes the project)

4. **Refund Mechanism**: If a project's deadline passes and it hasn't reached its goal, contributors can claim refunds.

## Project Structure

- `/contracts`: Solidity smart contracts
- `/scripts`: Deployment scripts
- `/src/components`: React components for the UI
- `/src/app`: Next.js pages and routes
- `/src/utils`: Utility functions for contract interactions
- Create 3 demo projects
- Update your .env file with the contract address

## Demo Flow (Under 5 Minutes)

1. Connect your MetaMask wallet to Sepolia network
2. Browse the 3 demo projects
3. Contribute a small amount of ETH to a project
4. Create your own project with a custom goal and description
5. As the creator, approve a milestone to release funds

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
