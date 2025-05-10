"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from "./abi";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center justify-center">
        <section className="flex flex-col items-center gap-3">
          <h1 className="text-2xl font-bold">
            Human-readable names for Polkadot
          </h1>
          <Separator className="my-4" />
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
          {!nameAvailable && <p>Address: {address}</p>}
        </section>

        <section className="flex flex-col items-center gap-8 w-full max-w-3xl mt-16">
          <h2 className="text-2xl font-bold">How it Works</h2>
          <p className="text-sm text-gray-600 text-center">
            Having trouble? Follow these simple steps:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center text-center gap-2">
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
