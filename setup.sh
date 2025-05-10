#!/bin/bash

# This script sets up the SimpleFund Dapp from scratch

echo "=== SimpleFund Setup Script ==="
echo "Setting up development environment..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
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
  echo "Please edit the .env file with your contract address, network settings, and private key"
fi

# Make script files executable
chmod +x dev-start.sh
chmod +x quick-demo.sh

# Compile contracts
echo "Compiling smart contracts..."
npx hardhat compile

echo
echo "=== Setup Complete ==="
echo 
echo "Next steps:"
echo "1. Update your .env file with your contract address and network"
echo "2. Run './dev-start.sh' to start a local development environment"
echo "3. For a quick demo run './quick-demo.sh'"
echo 
echo "For Sepolia deployment:"
echo "1. Add your Sepolia URL and private key to .env"
echo "2. Run 'npx hardhat run scripts/deploy-sepolia.js --network sepolia'"
echo "3. Copy the deployed contract address to your .env file"
echo "4. Set NEXT_PUBLIC_NETWORK=sepolia in your .env file"
echo
