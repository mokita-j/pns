# PNS (Polkadot Naming Service)

A decentralized naming system built with Next.js and Solidity smart contracts.

## Project Structure

The project consists of two main components:

- `pns-app/`: A Next.js application that provides the user interface
- `contracts/`: Solidity smart contracts that handle the core functionality

### Frontend Application (`pns-app/`)

The frontend is built with:

- Next.js
- TypeScript
- Tailwind CSS
- Modern React patterns and best practices

### Smart Contracts (`contracts/`)

The smart contracts are written in Solidity and handle the core functionality of the naming system.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (for package management)
- A Web3 wallet (like MetaMask)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/mokita-j/pns.git
cd pns
```

2. Install dependencies for the frontend:

```bash
cd pns-app
pnpm install
```

3. Set up your environment variables:

Create a `.env.local` file in the `pns-app` directory with the necessary environment variables.

### Development

To run the frontend application in development mode:

```bash
cd pns-app
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env.local` file in the `pns-app` directory with the following variables:

```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

To get your WalletConnect Project ID:

1. Go to [WalletConnect Cloud](https://cloud.reown.com/)
2. Sign up or log in
3. Create a new project
4. Copy the Project ID and paste it in your `.env.local` file

### Deployment

#### Frontend Deployment (Vercel)

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Sign up or log in with your GitHub account
4. Click "New Project"
5. Import your repository
6. Configure the project:
   - Root Directory: pns-app
7. Add your environment variables in the Vercel dashboard
8. Click "Deploy"

#### Smart Contract Deployment (Remix IDE)

1. Go to [Remix IDE](https://remix.polkadot.io/)
2. Connect your wallet (MetaMask or other Web3 wallet)
3. Create a new file in the contracts directory
4. Copy and paste your smart contract code
5. Compile the contract:
   - Click the "Solidity Compiler" tab
   - Select the appropriate compiler version
   - Click "Compile"
6. Deploy the contract:
   - Click the "Deploy & Run Transactions" tab
   - Select your contract from the dropdown
   - Click "Deploy"
   - Confirm the transaction in your wallet

Note: Before deploying, make sure to:

1. Add Asset Hub Westend Testnet to MetaMask:
   - Network name: Asset-Hub Westend Testnet
   - RPC URL: `https://westend-asset-hub-eth-rpc.polkadot.io`
   - Chain ID: `420420421`
   - Currency Symbol: `WND`
   - Block Explorer URL: `https://blockscout-asset-hub.parity-chains-scw.parity.io`
2. Get test tokens from the [Westend Faucet](https://faucet.polkadot.io/westend?parachain=1000)
   - Enter your MetaMask address
   - You'll receive 100 WND tokens per request
   - You can request tokens every 24 hours
