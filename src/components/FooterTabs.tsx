"use client";

import Link from "next/link";
import { Home, History, BarChart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export const FooterTabs = () => {
  const pathname = usePathname();
  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: History },
    { href: "/stats", label: "Stats", icon: BarChart },
    { href: "/chat", label: "Chat", icon: MessageCircle },
  ];
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-900 border-t border-neutral-800 z-50">
      <nav className="flex flex-row justify-around items-center h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link href={href} className="flex-1" key={href}>
              <Button
                variant="ghost"
                className={`w-full h-16 flex flex-col items-center gap-1 px-0 py-0 rounded-none border-none bg-transparent transition-colors
                  ${
                    isActive
                      ? "text-green-400 bg-neutral-800"
                      : "text-neutral-300 hover:text-white focus:text-white hover:bg-neutral-800 focus:bg-neutral-800"
                  }`}
                tabIndex={0}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
};
