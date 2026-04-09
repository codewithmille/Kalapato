"use client";

import { useState, useEffect } from "react";
import { ZapOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Only run on client
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-[#F5C518] border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] animate-pulse">
      <ZapOff className="h-4 w-4 stroke-[3px] text-black" />
      <span className="text-[10px] font-black uppercase tracking-widest text-black">
        OFFLINE_OPS_ACTIVE
      </span>
    </div>
  );
}
