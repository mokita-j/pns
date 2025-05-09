'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { Chain } from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const westendAssetHub: Chain = {
  id: 420420421,
  name: 'Westend Asset Hub',
  nativeCurrency: {
    decimals: 18,
    name: 'Westend',
    symbol: 'WND',
  },
  rpcUrls: {
    default: { http: ['https://westend-asset-hub-eth-rpc.polkadot.io'] },
    public: { http: ['https://westend-asset-hub-eth-rpc.polkadot.io'] },
  },
  blockExplorers: {
    default: { name: 'Westend Asset Hub Explorer', url: 'https://westend-assets.subscan.io' },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: 'PNS App',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [westendAssetHub],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 