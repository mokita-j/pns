"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutUs() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl w-full">
        <div className="flex flex-row items-center gap-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            About Us
          </h1>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-gray-200/20 p-8 rounded-2xl w-full shadow-lg">
        <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4 ring-4 ring-[#EC306E]/20">
              <AvatarImage
                src="/logo.svg"
              />
              <AvatarFallback className="text-2xl">
                PNS
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold text-gray-800">
            Polka Name Service (PNS)
            </h2>
            <p className="text-gray-500 mt-1">
            A lightweight naming system for the Polkadot ecosystem
            </p>
          </div>

            <Tabs defaultValue="project" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                
              </TabsList>
              <TabsContent value="project" className="space-y-4">
                <div className="space-y-4">
                  <p>
                    Designed to simplify multi-address management
                    across parachains and wallet UX.
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

              <TabsContent value="team" className="space-y-4">
                <div className="space-y-4">
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
                        Developer with expertise in web development
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
            </Tabs>
        </div>
      </div>
    </div>
  );
}
