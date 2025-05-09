'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract,  } from 'wagmi';
import { abi } from './abi';
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = '0x6938A48508DD26027aBF887A73255f1fcD890953';

export default function Home() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: 'nameToAddress',
    args: [name],
  });

  useEffect(() => {
    if (data) {
      setAddress(data.toString());
    }
  }, [data]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <ConnectButton />
          <h1 className="text-2xl font-bold">Human-readable names for Polkadot</h1>
          <h2 className="text-sm">Link names to your wallet address.</h2>
          <h2 className="text-sm">Simple, fast, and decentralized.</h2>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div>
            <p>Name:</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={() => refetch()}>Get Address</button>
            <p>Address: {address}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
