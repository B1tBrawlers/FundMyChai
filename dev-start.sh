#!/bin/bash

# This script sets up the development environment for the SimpleFund Dapp
# It starts a local Hardhat node, deploys the contract, and starts the Next.js dev server

echo "=== SimpleFund Development Environment ==="
echo "Setting up local blockchain and deploying contract..."
echo

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  if [ -f .env.example ]; then
    cp .env.example .env
  else
    cat > .env << EOL
# SimpleFund Environment Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_NETWORK=hardhat
SEPOLIA_URL=
PRIVATE_KEY=
EOL
  fi
fi

# Update the .env to use local network
sed -i 's/NEXT_PUBLIC_NETWORK=.*/NEXT_PUBLIC_NETWORK=hardhat/g' .env

# Start Hardhat node in background
echo "Starting Hardhat node..."
npx hardhat node > hardhat.log 2>&1 &
NODE_PID=$!

# Wait for node to start
echo "Waiting for node to initialize..."
sleep 5

# Deploy contract to local network
echo "Deploying contract to local network..."
npx hardhat run scripts/deploy-with-demos.js --network localhost

# Get the contract address and update .env
CONTRACT_ADDRESS=$(grep "SimpleFund deployed to:" hardhat.log | tail -1 | awk '{print $4}')
if [ ! -z "$CONTRACT_ADDRESS" ]; then
  sed -i "s/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/g" .env
  echo "Contract deployed to: $CONTRACT_ADDRESS"
  echo "Updated .env with the contract address"
else
  echo "Couldn't find the contract address. Please check hardhat.log and update your .env manually."
fi

# Start Next.js development server
echo
echo "Starting Next.js development server..."
echo "Please connect MetaMask to localhost:8545 (Hardhat Network)"
echo "Import a test account using the private keys from hardhat.log"
echo
echo "Press Ctrl+C to stop the server when done"
echo

npm run dev

# When Next.js server stops, also stop the Hardhat node
echo "Shutting down Hardhat node..."
kill $NODE_PID
