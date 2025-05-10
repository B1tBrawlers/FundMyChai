#!/bin/bash

# This script provides a quick 5-minute demo of the SimpleFund Dapp
# It sets up a local Hardhat node, deploys the contract with demo projects,
# and starts the Next.js development server

echo "=== SimpleFund 5-Minute Demo ==="
echo "Setting up a complete local environment with demo projects"
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

# Compile contracts
echo "Compiling smart contracts..."
npx hardhat compile

# Start Hardhat node in background
echo "Starting local Ethereum node..."
npx hardhat node > hardhat.log 2>&1 &
HARDHAT_PID=$!

# Give it a moment to start
sleep 3

# Deploy the contract with demo projects
echo "Deploying contract with demo projects..."
npx hardhat run --network localhost scripts/deploy-with-demos.js

# Get the contract address and update .env
CONTRACT_ADDRESS=$(grep "SimpleFund deployed to:" hardhat.log | tail -1 | awk '{print $4}')
if [ ! -z "$CONTRACT_ADDRESS" ]; then
  sed -i "s/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/g" .env
  echo "Contract deployed to: $CONTRACT_ADDRESS"
  echo "Updated .env with the contract address"
else
  echo "Couldn't find the contract address. Please check hardhat.log and update your .env manually."
fi

echo
echo "=== Demo Setup Complete ==="
echo "Starting development server..."
echo "Please connect MetaMask to localhost:8545 (Hardhat Network)"
echo "Import a test account using the private keys from the hardhat node output"
echo
echo "Press Ctrl+C to stop the server when done"
echo

# Start the Next.js dev server
npm run dev

# When Next.js is stopped, also stop the Hardhat node
echo "Stopping Hardhat node..."
kill $HARDHAT_PID
