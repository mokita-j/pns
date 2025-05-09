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
