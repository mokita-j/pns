import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

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
          <header className="flex items-center justify-between w-full p-[30px]">
            <Image src="/logo.svg" alt="logo" width={200} height={70} />
            <div className="flex items-center gap-[20px]">
              <ConnectButton />
              <Link href="https://github.com/mokita-j/pns">
                <SiGithub />
              </Link>
            </div>
          </header>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
