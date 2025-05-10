"use client";

import { useReadContract } from "wagmi";
import { abi } from "../abi";
import { use } from "react";

const CONTRACT_ADDRESS = "0x6938A48508DD26027aBF887A73255f1fcD890953";

function ProfileContent({ name }: { name: string }) {
  const { data: address } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "nameToAddress",
    args: [name],
  });

  if (
    !address ||
    address.toString() === "0x0000000000000000000000000000000000000000"
  ) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p>The name &quot;{name}&quot; is not registered yet.</p>
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
