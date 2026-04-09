"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plane, LayoutDashboard, Trophy, Map as MapIcon, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { OfflineStatus } from "@/components/OfflineStatus";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events", href: "/events", icon: Trophy },
    { name: "Map View", href: "/map", icon: MapIcon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-[4px] border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center border-[4px] border-black bg-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
              <Plane className="h-7 w-7 rotate-[-45deg] stroke-[3px]" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter uppercase text-black">
                Kalapato
              </span>
              <span className="text-[10px] font-bold text-black/60 uppercase tracking-widest hidden sm:block">
                Precision Flight Ops
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

        <div className="flex items-center gap-4">
          <OfflineStatus />
          {status === "loading" ? (
            <div className="h-8 w-24 animate-pulse bg-gray-200 nb-card border-none shadow-none" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-3 group/profile">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-black px-1">Active_Pilot</span>
                  <span className="text-xs font-black uppercase text-black truncate max-w-[120px] group-hover/profile:text-primary transition-colors">
                    {session.user?.name}
                  </span>
                </div>
                <div className="h-10 w-10 border-[3px] border-black bg-white flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] group-hover/profile:bg-primary group-hover/profile:translate-x-[1px] group-hover/profile:translate-y-[1px] group-hover/profile:shadow-none transition-all">
                  <User className="h-5 w-5" />
                </div>
              </Link>
              <Button 
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="ghost" 
                className="font-black uppercase text-xs hover:bg-destructive hover:text-white border-[3px] border-transparent hover:border-black hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition-all h-10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-black uppercase text-xs hover:bg-black/5 h-10">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="nb-button bg-primary text-black h-10 text-xs px-4">
                  JOIN FLEET
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
