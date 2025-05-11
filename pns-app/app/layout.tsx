import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "react-icons/si";
import { Coffee } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InteractiveDots } from "@/components/ui/interactive-dots";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PNS App",
  description: "PNS App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <header className="flex items-center justify-between w-full p-[30px] max-w-5xl mx-auto">
            <Link href="/">
              <Image src="/logo.svg" alt="logo" width={200} height={70} />
            </Link>
            <div className="flex items-center gap-[20px]">
              <div className="scale-75 origin-right">
                <ConnectButton />
              </div>
              <Link href="https://github.com/mokita-j/pns">
                <SiGithub size={24} />
              </Link>
            </div>
          </header>
          {children}
          <footer className="w-full border-t mt-auto max-w-5xl mx-auto">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-8">
                  <Link
                    href="/about-us"
                    className="text-sm hover:text-[#EC306E]"
                  >
                    About Us
                  </Link>
                  <Separator orientation="vertical" />
                  <Link
                    href="https://pns.gitbook.io/"
                    className="text-sm hover:text-[#EC306E]"
                  >
                    Docs
                  </Link>
                </div>
                <a
                  href="https://www.buymeacoffee.com/helenaboing"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm hover:text-[#EC306E] flex items-center gap-2"
                >
                  Buy me a Coffee
                  <Coffee size={16} />
                </a>
              </div>
              <div className="text-center text-sm text-gray-500">Polkadot Name Service © 2025</div>
            </div>
          </footer>
          <InteractiveDots />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
