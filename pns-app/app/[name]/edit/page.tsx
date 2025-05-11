"use client";

import { useReadContract, useWriteContract } from "wagmi";
import { abiPNS, abiMetadataResolver } from "@/app/abi";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { nameToHash } from "@/lib/utils";
import Error from "next/error";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopyButton } from "@/components/ui/copy-button";
import { PencilOff } from "lucide-react";
import { toast } from "sonner";

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
  email: "",
  name: "",
  description: "",
  image: "/pufferfish.png",
  website: "",
  twitter: "",
  telegram: "",
  discord: "",
};

const CONTRACT_ADDRESS_PNS = "0xBE10c808B7ea10542b9F91418Ad3A696a132358d";
const CONTRACT_ADDRESS_METADATA_RESOLVER =
  "0xa19f97DBcDF7E456774F6DFF5324AC10d82E00Ce";

function ProfileContent({ name }: { name: string }) {
  const [nameHash, setNameHash] = useState<string | null>(null);
  const [formData, setFormData] = useState(LOADING_METADATA);

  const { data: address, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS_PNS,
    abi: abiPNS,
    functionName: "owner",
    args: [nameHash],
  });

  const { data: metadataJson, isLoading: isLoadingMetadata } = useReadContract({
    address: CONTRACT_ADDRESS_METADATA_RESOLVER,
    abi: abiMetadataResolver,
    functionName: "metadata",
    args: [nameHash],
  });

  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    if (isLoadingMetadata) {
      setFormData(LOADING_METADATA);
    }
  }, [isLoadingMetadata]);

  useEffect(() => {
    if (metadataJson && typeof metadataJson === "string") {
      try {
        const fixedJson = metadataJson.replace(/'/g, '"');
        const metadata = JSON.parse(fixedJson);
        setFormData(metadata);
      } catch (e) {
        console.error("Error parsing metadataJson:", e);
        setFormData(DEFAULT_METADATA);
      }
    } else {
      setFormData(DEFAULT_METADATA);
    }
  }, [metadataJson]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameHash) return;

    const metadataString = JSON.stringify(formData);
    writeContract({
      address: CONTRACT_ADDRESS_METADATA_RESOLVER,
      abi: abiMetadataResolver,
      functionName: "setMetadata",
      args: [nameHash, metadataString],
    },
    {
      onSettled: (data, error) => {
        if (data) {
          toast.success("Transaction sent!");
          setTimeout(() => {
            window.location.href = `/${name}`;
          }, 2000);
        } else if (error) {
          toast.error("Transaction failed!");
        }
      },
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

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex flex-row items-center gap-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Edit {name}
          </h1>
          <CopyButton value={name} iconSize={30} />
        </div>
       
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-gray-200/20 p-8 rounded-2xl w-full shadow-lg">
        <div className="flex flex-row items-center gap-2 justify-end">
          <Link href={`/${name}`}>
            <PencilOff className="w-4 h-4" />
          </Link>
        </div>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-[#EC306E]/20">
              <AvatarImage
                src={formData.image || "/pufferfish.png"}
              />
              <AvatarFallback className="text-2xl">
                {formData.name ? formData.name.charAt(0) : "N"}
              </AvatarFallback>
            </Avatar>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className="max-w-xs mt-4"
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Your description"
              className="max-w-xs mt-4"
            />
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
                <p className="text-sm break-all font-mono">
                  {address.toString()}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </h3>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email"
                  className="bg-transparent border-0 p-0 h-auto text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Website
                </h3>
                <Input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Your website"
                  className="bg-transparent border-0 p-0 h-auto text-sm"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Twitter
                </h3>
                <Input
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="Your Twitter username"
                  className="bg-transparent border-0 p-0 h-auto text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Telegram
                </h3>
                <Input
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleInputChange}
                  placeholder="Your Telegram username"
                  className="bg-transparent border-0 p-0 h-auto text-sm"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Discord
                </h3>
                <Input
                  name="discord"
                  value={formData.discord}
                  onChange={handleInputChange}
                  placeholder="Your Discord username"
                  className="bg-transparent border-0 p-0 h-auto text-sm"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Profile Image URL
              </h3>
              <Input
                name="image"
                type="url"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Your profile image URL"
                className="bg-transparent border-0 p-0 h-auto text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href={`/${name}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
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
