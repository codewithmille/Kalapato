"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plane, LayoutDashboard, Trophy, Map as MapIcon, LogOut, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { OfflineStatus } from "@/components/OfflineStatus";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Ronda Clock", href: "/ronda", icon: Clock },
    { name: "Events", href: "/events", icon: Trophy },
    { name: "Map View", href: "/map", icon: MapIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-[4px] border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="md:hidden p-2 h-10 w-10 border-[3px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6 stroke-[3px]" /> : <Menu className="h-6 w-6 stroke-[3px]" />}
          </Button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border-[4px] border-black bg-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all overflow-hidden p-1">
              <img src="/pigeon-logo.png" alt="Kalapato" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase text-black leading-none">
                {/* Shorten on Very Small Screens */}
                <span className="sm:inline">Kalapato</span>
              </span>
            </div>
          </Link>
          
          <nav className="ml-10 hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-[3px] border-transparent font-black uppercase text-xs tracking-widest transition-all hover:bg-primary hover:text-black hover:border-black hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
                  pathname.startsWith(item.href) ? "bg-primary text-black border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]" : "text-gray-500"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <OfflineStatus />
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse bg-gray-200 nb-card border-none shadow-none" />
          ) : session ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/profile" className="flex items-center gap-3 group/profile">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-black px-1">Active_Pilot</span>
                  <span className="text-xs font-black uppercase text-black truncate max-w-[120px] group-hover/profile:text-primary transition-colors">
                    {session.user?.name}
                  </span>
                </div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 border-[3px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] group-hover/profile:bg-primary group-hover/profile:translate-x-[1px] group-hover/profile:translate-y-[1px] group-hover/profile:shadow-none transition-all">
                  <User className="h-5 w-5" />
                </div>
              </Link>
              <Button 
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="ghost" 
                className="font-black uppercase text-[10px] sm:text-xs hover:bg-destructive hover:text-white border-[3px] border-transparent hover:border-black hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all h-9 sm:h-10 px-2 sm:px-4"
              >
                <LogOut className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Log Out</span>
                <span className="sm:hidden">OFF</span>
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-black uppercase text-[10px] sm:text-xs hover:bg-black/5 h-9 sm:h-10 px-2">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="nb-button bg-primary text-black h-9 sm:h-10 text-[10px] sm:text-xs px-2 sm:px-4">
                  JOIN
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t-[4px] border-black p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 p-4 border-[3px] font-black uppercase text-sm tracking-widest",
                pathname.startsWith(item.href) 
                  ? "bg-primary text-black border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]" 
                  : "border-gray-200 text-gray-500"
              )}
            >
              <item.icon className="h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
