"use client";

import { useAccount, useReadContract } from "wagmi";
import { abiPNS } from "../abi";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { nameToHash } from "@/lib/utils";
import Error from "next/error";
import { abiMetadataResolver } from "../abi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/ui/copy-button";
import { Edit } from "lucide-react";

const LOADING_METADATA = {
  email: "Loading...",
  name: "Loading...",
  description: "Loading...",
  image: "/pufferfish.png",
  website: "Loading...",
  twitter: "Loading...",
  telegram: "Loading...",
  discord: "Loading...",
};

const DEFAULT_METADATA = {
  email: "Add your email",
  name: "Add your name",
  description: "Add your description",
  image: "/pufferfish.png",
  website: "Add your website",
  twitter: "Add your twitter",
  telegram: "Add your telegram",
  discord: "Add your discord",
};

const CONTRACT_ADDRESS_PNS = "0xBE10c808B7ea10542b9F91418Ad3A696a132358d";
const CONTRACT_ADDRESS_METADATA_RESOLVER =
  "0xa19f97DBcDF7E456774F6DFF5324AC10d82E00Ce";

function ProfileContent({ name }: { name: string }) {
  const [nameHash, setNameHash] = useState<string | null>(null);
  const [metadata, setMetadata] = useState(LOADING_METADATA);
  const [isOwner, setIsOwner] = useState(false);

  const { address: clientAddress } = useAccount();

  const { data: address, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHash],
  });

  useEffect(() => {
    if (address && address.toString() === clientAddress?.toString()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [address, clientAddress]);

  const { data: metadataJson, isLoading: isLoadingMetadata } = useReadContract({
    address: CONTRACT_ADDRESS_METADATA_RESOLVER,
    abi: abiMetadataResolver,
    functionName: "metadata",
    args: [nameHash],
  });

  useEffect(() => {
    if (isLoadingMetadata) {
      setMetadata(LOADING_METADATA);
    }
  }, [isLoadingMetadata]);

  useEffect(() => {
    if (metadataJson && typeof metadataJson === "string") {
      try {
        // Replace single quotes with double quotes
        const fixedJson = metadataJson.replace(/'/g, '"');
        const metadata = JSON.parse(fixedJson);
        setMetadata(metadata);
      } catch (e) {
        console.error("Error parsing metadataJson:", e);
        setMetadata(DEFAULT_METADATA);
      }
    } else {
      setMetadata(DEFAULT_METADATA);
    }
  }, [metadataJson]);

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

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex flex-row items-center gap-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {name}
          </h1>
          <CopyButton value={name} iconSize={30} />
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-gray-200/20 p-8 rounded-2xl w-full shadow-lg">
          {isOwner && (
            <div className="flex flex-row items-center gap-2 justify-end">
              <Link href={`/${name}/edit`}>
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          )}
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-[#EC306E]/20">
              <AvatarImage
                src={
                  metadata?.image
                    ? metadata.image
                    : "/pufferfish.png"
                }
              />
              <AvatarFallback className="text-2xl">
                {metadata?.name ? metadata.name.charAt(0) : "N"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-gray-800">
              {metadata?.name || ""}
            </h2>
            <p className="text-gray-500 mt-1">
              {metadata?.description || ""}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-row items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Address
                  </h3>
                  <CopyButton value={address.toString()} iconSize={16} />
                </div>

                <Link href={`https://blockscout-asset-hub.parity-chains-scw.parity.io/address/${address.toString()}`} target="_blank" rel="noopener noreferrer">
                  <p className="text-sm break-all font-mono">
                    {address.toString()}
                  </p>
                </Link>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </h3>
                <p className="text-sm">{metadata?.email || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Website
                </h3>
                <a
                  href={metadata?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#EC306E] hover:underline"
                >
                  {metadata?.website || "-"}
                </a>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Twitter
                </h3>
                <a
                  href={`https://twitter.com/${metadata?.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#EC306E] hover:underline"
                >
                  {metadata?.twitter
                    ? `@${metadata.twitter}`
                    : "-"}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Telegram
                </h3>
                <a
                  href={`https://t.me/${metadata?.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#EC306E] hover:underline"
                >
                  {metadata?.telegram
                    ? `@${metadata.telegram}`
                    : "-"}
                </a>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Discord
                </h3>
                <a
                  href={`https://discord.com/users/${metadata?.discord}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#EC306E] hover:underline"
                >
                  {metadata?.discord
                    ? `@${metadata.discord}`
                    : "-"}
                </a>
              </div>
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
