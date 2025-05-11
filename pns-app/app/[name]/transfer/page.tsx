"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abiPNS } from "@/app/abi";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { nameToHash } from "@/lib/utils";
import Error from "next/error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CONTRACT_ADDRESS_PNS = "0xBE10c808B7ea10542b9F91418Ad3A696a132358d";

function ProfileContent({ name }: { name: string }) {
  const [nameHash, setNameHash] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const { address: clientAddress } = useAccount();
  const { writeContract, data: hash } = useWriteContract();

  const { data: address, isLoading, refetch } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHash],
  });

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success(
        `Domain ownership transferred successfully!`,
        {
          action: {
            label: "View Profile",
            onClick: () => window.open(`/${name}`, "_blank"),
          },
        }
      );
      refetch();
      setTimeout(() => {
        refetch();
      }, 5000);
    }
  }, [isConfirmed, name, refetch]);

  useEffect(() => {
    if (address && address.toString() === clientAddress?.toString()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [address, clientAddress]);

  useEffect(() => {
    const count = name.split(".").length;
    
    if (count === 2) {
      const [prefix, suffix] = name.split(".");
      const tld = suffix.toUpperCase();
      if (["DOT", "JAM"].includes(tld)) {
        setNameHash(nameToHash(prefix, tld));
      } else {
        setNameHash(null);
      }
    }

    if (count === 3) {
      const [prefix, middle, suffix] = name.split(".");
      const tld = suffix.toUpperCase();
      if (["DOT", "JAM"].includes(tld)) {
        setNameHash(nameToHash(middle, tld, prefix));
      } else {
        setNameHash(null);
      }
    }
  }, [name]);

  const handleTransfer = async () => {
    if (!newOwnerAddress || !nameHash) return;

    const promise = new Promise((resolve, reject) => {
      writeContract(
        {
          address: CONTRACT_ADDRESS_PNS,
          abi: abiPNS,
          functionName: "setOwner",
          args: [nameHash, newOwnerAddress],
        },
        {
          onSettled: (data, error) => {
            if (data) {
              resolve(data);
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
      error: "Failed to transfer domain ownership",
    });
  };

  if (!name.includes(".")) {
    return <Error statusCode={404} />;
  }

  if (nameHash === null) {
    return <Error statusCode={404} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="bg-gray-100 p-6 rounded-lg w-full">
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (
    !address ||
    address.toString() === "0x0000000000000000000000000000000000000000"
  ) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="bg-gray-100 p-6 rounded-lg w-full">
            <p className="break-all">
              The name &quot;{name}&quot; is not registered yet.
              <br />
              <br />
              <Button asChild>
                <Link href={`/`}>Register it now</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
          <h1 className="text-3xl font-bold">{name}</h1>
          <div className="bg-gray-100 p-6 rounded-lg w-full">
            <p className="break-all">
              You are not the owner of this domain.
            </p>
          </div>
          <Button asChild>
              <Link href={`/${name}`}>Back</Link>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex flex-row items-center gap-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Transfer {name}
          </h1>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-gray-200/20 p-8 rounded-2xl w-full shadow-lg">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newOwner">New Owner Address</Label>
              <Input
                id="newOwner"
                placeholder="0x..."
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleTransfer}
                disabled={!newOwnerAddress}
                className="w-full"
              >
                Transfer Ownership
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href={`/${name}`}>Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  return <ProfileContent name={name} />;
}
