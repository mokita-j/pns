"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { abiPNS, abiBaseRegistrar } from "./abi";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PartyPopper } from "lucide-react";
import { nameToHash } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const CONTRACT_ADDRESS_PNS = "0xBE10c808B7ea10542b9F91418Ad3A696a132358d";
// const CONTRACT_ADDRESS_RESOLVER = "0x1Ee165d0F70d6672A8a6C954Bc993e9c4Ef7bB17";
const CONTRACT_ADDRESS_REGISTRAR_DOT =
  "0x56fdDF0Eb0567371715997E43106bBE4667990C5";
const CONTRACT_ADDRESS_REGISTRAR_JAM =
  "0xcBc1C5f7A095e5947d987eB41369327e775998fe";
// const PARENT_NODE_DOT =
//   "0x3fce7d1364a893e213bc4212792b517ffc88f5b13b86c8ef9c8d390c3a1370ce";
// const PARENT_NODE_JAM =
//   "0x6f142072f4756fbc7aaa14293ad39fafc39e33b39953c16205e8c1e0b04791bd";
// const ROOT_NODE =
//   "0x0000000000000000000000000000000000000000000000000000000000000000";
const DEFAULT_DURATION = 31536000; // 1 year

export default function Home() {
  const [name, setName] = useState("");
  const [nameHashDOT, setNameHashDOT] = useState("");
  const [nameHashJAM, setNameHashJAM] = useState("");
  const [nameAvailableDOT, setNameAvailableDOT] = useState(true);
  const [nameAvailableJAM, setNameAvailableJAM] = useState(true);
  const [mounted, setMounted] = useState(false);
  const registeredNameRef = useRef("");
  const { address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { data: ownerDOT, refetch: refetchDOT } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHashDOT],
  });

  const { data: ownerJAM, refetch: refetchJAM } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHashJAM],
  });

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        `Congratulations! You now own ${registeredNameRef.current}!`,
        {
          action: {
            label: "View Profile",
            onClick: () =>
              window.open(`/${registeredNameRef.current}`, "_blank"),
          },
          // Transaction ID: ${hash} https://blockscout-asset-hub.parity-chains-scw.parity.io/tx/${hash}
          icon: <PartyPopper className="px-[2px]" />,
        }
      );
      refetchDOT();
      refetchJAM();
    }
  }, [isConfirmed, hash]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (ownerDOT) {
      if (ownerDOT.toString() === "0x0000000000000000000000000000000000000000") {
        setNameAvailableDOT(true);
      } else {
        setNameAvailableDOT(false);
      }
    }
  }, [ownerDOT]);

  useEffect(() => {
    if (ownerJAM) {
      if (ownerJAM.toString() === "0x0000000000000000000000000000000000000000") {
        setNameAvailableJAM(true);
      } else {
        setNameAvailableJAM(false);
      }
    }
  }, [ownerJAM]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);

    const myNameHashDOT = nameToHash(e.target.value, "DOT");
    const myNameHashJAM = nameToHash(e.target.value, "JAM");
    if (myNameHashDOT) {
      setNameHashDOT(myNameHashDOT);
    }
    if (myNameHashJAM) {
      setNameHashJAM(myNameHashJAM);
    }
    refetchDOT();
    refetchJAM();
  };

  const handleRegister = (tld: string) => {
    if (!isConnected) {
      toast.error("Connect your wallet");
      return;
    }
    if (tld === "DOT" && !nameAvailableDOT) {
      toast.error("Name already taken");
      return;
    }
    if (tld === "JAM" && !nameAvailableJAM) {
      toast.error("Name already taken");
      return;
    }
    if (name.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    
    registeredNameRef.current = name + "." + tld.toLowerCase();
   
    const promise = new Promise((resolve, reject) => {
      const duration = DEFAULT_DURATION;
      const owner = address; // address of the wallet connected to the app
      writeContract(
        {
          address: tld === "DOT" ? CONTRACT_ADDRESS_REGISTRAR_DOT : tld === "JAM" ? CONTRACT_ADDRESS_REGISTRAR_JAM : "0x0000000000000000000000000000000000000000",
          abi: abiBaseRegistrar,
          functionName: "register",
          args: [name, owner, duration],
        },
        {
          onSettled: (data, error) => {
            resolve(data);
            if (data) {
              refetchDOT();
              refetchJAM();
              setTimeout(() => {
                refetchDOT();
                refetchJAM();
              }, 5000);
            } else if (error) {
              reject(error);
            }
          },
        }
      );
    });

    toast.promise(promise, {
      loading: "Wait and approve the transaction in your wallet",
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
            className="border-3 border-gray-300 rounded-md p-2 bg-gray-100 text-black gap-[5px] flex items-center justify-center max-w-[300px] my-2"
            type="text"
            value={name}
            placeholder="Check if your name is available"
            onChange={handleNameChange}
          />
          <div className="h-[6px] gap-[5px]" />
          {/* DOT */}
          {name.length > 2 && (
            nameAvailableDOT? (
              isConnected ? (
                <Button
                className="bg-[#EC306E] text-white p-2 rounded-md gap-[5px] flex items-center justify-center my-1"
                disabled={!nameAvailableDOT || isPending}
                onClick={() => handleRegister("DOT")}
              >
                Get {name}.dot now! 🚀
              </Button>
            ) : (
              <ConnectButton label="Connect to Register" />
            )
          ) : (
            <Button asChild>
              <Link href={`/${name}.dot`}>View {name}.dot</Link>
            </Button>
          ))}

          {/* JAM */}
          {name.length > 2 && (
            nameAvailableJAM ? (
              isConnected ? (
                <Button
                className="bg-[#EC306E] text-white p-2 rounded-md gap-[5px] flex items-center justify-center my-1"
                disabled={!nameAvailableJAM || isPending}
                onClick={() => handleRegister("JAM")}
              >
                Get {name}.jam now! 🚀
              </Button>
            ) : (
              <ConnectButton label="Connect to Register" />
            )
          ) : (
            <Button asChild>
              <Link href={`/${name}.jam`}>View {name}.jam</Link>
            </Button>
          ))}
        </section>

        <section className="flex flex-col items-center gap-3 w-full max-w-3xl mt-[200px]">
          <h2 className={`${orbitron.className} text-2xl font-bold`}>
            How it Works
          </h2>
          <p className="text-sm text-gray-600 text-center mb-10">
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
