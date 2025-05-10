"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "./abi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

const CONTRACT_ADDRESS = "0x6938A48508DD26027aBF887A73255f1fcD890953";

export default function Home() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nameAvailable, setNameAvailable] = useState(true);
  const { writeContract } = useWriteContract();
  const { data, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "nameToAddress",
    args: [name],
  });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (data) {
      setAddress(data.toString());
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
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "register",
        args: [name],
      },
      {
        onSettled: (data, error) => {
          if (data) {
            toast.success("Name registered successfully");
            refetch();
          } else if (error) {
            toast.error("Error registering name: " + error);
          }
        },
      }
    );
  };

  const { isConnected } = useAccount();

  if (!mounted) return null;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between w-full p-[30px]">
        <Image src="/logo.svg" alt="logo" width={200} height={70} />
        <div className="flex items-center gap-[20px]">
          <ConnectButton />
          <Link href="https://github.com/mokita-j/pns">
            <SiGithub />
          </Link>
        </div>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold">
            Human-readable names for Polkadot
          </h1>
          <h2 className="text-sm">Link names to your wallet address.</h2>
          <h2 className="text-sm">Simple, fast, and decentralized.</h2>
          <input
            className="border-2 border-gray-300 rounded-md p-2 bg-gray-100 text-black"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
          <button
            className="bg-[#EC306E] text-white p-2 rounded-md"
            disabled={!nameAvailable}
            onClick={handleRegister}
          >
            {!nameAvailable
              ? "Name already taken"
              : !isConnected
              ? "Connect your wallet"
              : "Get your name now 🚀"}
          </button>
          {!nameAvailable && (
            <div className="flex flex-col items-center gap-2">
              <p>Address: {address}</p>
              <a 
                href={`/${name}`}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View Profile
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
