"use client";

import { useReadContract } from "wagmi";
import { abiPNS } from "../abi";
import { use, useEffect, useState } from "react"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { nameToHash } from "@/lib/utils";
import Error from 'next/error'

const CONTRACT_ADDRESS_PNS = "0xBE10c808B7ea10542b9F91418Ad3A696a132358d";

function ProfileContent({ name }: { name: string }) {
  const [nameHash, setNameHash] = useState<string | null>(null);
  const { data: address, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHash],
  });

  useEffect(() => {
    if (name.includes(".")) {
      const [prefix, suffix] = name.split(".");
      const tld = suffix.toUpperCase();
      if (["DOT", "JAM"].includes(tld)) {
        setNameHash(nameToHash(prefix, tld));
      } else {
        setNameHash(null);
      }
    }
  }, [name]);
  
  if (!name.includes(".")) {
    return <Error statusCode={404} />
  }

  if (nameHash === null) {
    return <Error statusCode={404} />
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

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="bg-gray-100 p-6 rounded-lg w-full">
          <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
          <p className="break-all">
            <span className="font-medium">Address: </span>
            {address.toString()}
          </p>
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
