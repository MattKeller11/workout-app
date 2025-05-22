import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Home, History, BarChart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Workout Generator",
  description: "Generate your next workout with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="fixed bottom-0 left-0 w-full bg-neutral-900 border-t border-neutral-800 z-50">
          <nav className="flex flex-row justify-around items-center h-16">
            <Link href="/" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-16 flex flex-col items-center gap-1 text-neutral-300 hover:text-white focus:text-white px-0 py-0 rounded-none border-none bg-transparent hover:bg-neutral-800 focus:bg-neutral-800 transition-colors"
              >
                <Home className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-16 flex flex-col items-center gap-1 text-neutral-300 hover:text-white focus:text-white px-0 py-0 rounded-none border-none bg-transparent hover:bg-neutral-800 focus:bg-neutral-800 transition-colors"
              >
                <History className="w-6 h-6" />
                <span className="text-xs">History</span>
              </Button>
            </Link>
            <Link href="/stats" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-16 flex flex-col items-center gap-1 text-neutral-300 hover:text-white focus:text-white px-0 py-0 rounded-none border-none bg-transparent hover:bg-neutral-800 focus:bg-neutral-800 transition-colors"
              >
                <BarChart className="w-6 h-6" />
                <span className="text-xs">Stats</span>
              </Button>
            </Link>
            <Link href="/chat" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-16 flex flex-col items-center gap-1 text-neutral-300 hover:text-white focus:text-white px-0 py-0 rounded-none border-none bg-transparent hover:bg-neutral-800 focus:bg-neutral-800 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs">Chat</span>
              </Button>
            </Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
