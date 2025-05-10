"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "./abi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const CONTRACT_ADDRESS = "0x6938A48508DD26027aBF887A73255f1fcD890953";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export default function Home() {
  const [name, setName] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const { 
    data: hash, 
    isPending, 
    writeContract 
  } = useWriteContract() 
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "nameToAddress",
    args: [name],
  });
  const [mounted, setMounted] = useState(false);

  const { isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed) {
      toast.success(`The name was registered successfully. Transaction ID: ${hash} https://blockscout-asset-hub.parity-chains-scw.parity.io/tx/${hash}`);
    }
  }, [isConfirmed, hash]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (data) {
      if (data.toString() === "0x0000000000000000000000000000000000000000") {
        setNameAvailable(true);
      } else {
        setNameAvailable(false);
      }
    }
  }, [data]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    refetch();
  };

  const handleRegister = () => {
    if (!isConnected) {
      toast.error("Connect your wallet");
      return;
    }
    if (!nameAvailable) {
      toast.error("Name already taken");
      return;
    }
    if (name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    const promise = new Promise((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "register",
          args: [name],
        },
        {
          onSettled: (data, error) => {
            resolve(data);
            if (data) {
              refetch();
              setTimeout(() => {
                refetch();
              }, 5000);
            } else if (error) {
              reject(error);
            }
          },
        }
      );
    });

    toast.promise(promise, {
      loading: "Wait and approve transaction in your wallet",
      success: "Transaction sent",
      error: "Error registering name",
    });
  };

  const { isConnected } = useAccount();
  
  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-3 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center justify-center">
        <section className="flex flex-col items-center">
          <h1 className={`${orbitron.className} text-2xl font-bold`}>
            Human-readable names for Polkadot
          </h1>
          <div className="h-[6px]" />
          <Separator className="w-[120px]" />
          <div className="h-[6px] gap-[5px]" />
          <h2 className="text-sm">Link names to your wallet address.</h2>
          <h2 className="text-sm">Simple, fast, and decentralized.</h2>
          <div className="h-[6px] gap-[5px]" />
          <Input
            className="border-3 border-gray-300 rounded-md p-2 bg-gray-100 text-black gap-[5px] flex items-center justify-center max-w-[300px]"
            type="text"
            value={name}
            placeholder="Check if your name is available"
            onChange={handleNameChange}
          />
          <div className="h-[6px] gap-[5px]" />
          {nameAvailable ? (
            isConnected ? (
            <Button
              className="bg-[#EC306E] text-white p-2 rounded-md gap-[5px] flex items-center justify-center"
              disabled={!nameAvailable || isPending}
              onClick={handleRegister}
            >
              Get your name now 🚀
            </Button>
          ) : <ConnectButton label="Connect to Register" />
          ) : (
            <Button asChild>
              <Link href={`/${name}`}>View Profile</Link>
            </Button>
          )}
        </section>

        <section className="flex flex-col items-center gap-3 w-full max-w-3xl mt-16">
          <h2 className={`${orbitron.className} text-2xl font-bold`}>
            How it Works
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Having trouble? Follow these simple steps:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-12 h-12 rounded-full bg-[#EC306E] text-white flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold">Pick a name</h3>
              <p className="text-sm text-gray-600">
                Choose your preferred name for your wallet address
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#EC306E] text-white flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold">Connect your wallet</h3>
              <p className="text-sm text-gray-600">
                Link your wallet to register your chosen name
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#EC306E] text-white flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold">Register and use it</h3>
              <p className="text-sm text-gray-600">
                Use your name across all Polkadot parachains
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
