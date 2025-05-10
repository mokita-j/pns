"use client";

import { useReadContract } from "wagmi";
import { abi } from "../abi";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CONTRACT_ADDRESS = "0x6938A48508DD26027aBF887A73255f1fcD890953";

function ProfileContent({ name }: { name: string }) {
  const { data: address, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "nameToAddress",
    args: [name],
  });

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
      <div className="flex flex-col items-center gap-4 max-w-4xl w-full">
        <h1 className="text-3xl font-bold">{name}</h1>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Polka Name Service (PNS)</CardTitle>
            <CardDescription>
              A lightweight naming system for the Polkadot ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Domain Information</h3>
                  <p className="break-all">
                    <span className="font-medium">Address: </span>
                    {address.toString()}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Our Team</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold">Monica Jin</h4>
                      <p className="text-sm text-muted-foreground">
                        Research Engineer
                      </p>
                      <p className="mt-1">
                        Specializing in automatic program repair for smart
                        contracts and blockchain security.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Miguel Fernandes</h4>
                      <p className="text-sm text-muted-foreground">
                        Software Engineer
                      </p>
                      <p className="mt-1">
                        Experienced developer with expertise in web development
                        and full-stack applications.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Helena Boing</h4>
                      <p className="text-sm text-muted-foreground">
                        UX/UI Designer
                      </p>
                      <p className="mt-1">
                        Focused on creating exceptional digital experiences and
                        marketing strategies.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">About PNS</h3>
                  <p>
                    PNS is a lightweight naming system tailored for the Polkadot
                    ecosystem, designed to simplify multi-address management
                    across parachains and enhance wallet UX.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Features</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Human-readable names for blockchain addresses</li>
                      <li>Cross-chain compatibility</li>
                      <li>Simple registration and transfer system</li>
                      <li>Enhanced wallet user experience</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
