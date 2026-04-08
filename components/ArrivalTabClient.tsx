"use client";

import { useSession } from "next-auth/react";
import { ArrivalInputForm } from "./ArrivalInputForm";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import Link from "next/link";

interface ArrivalTabClientProps {
  eventId: string;
  registrations: any[];
}

export function ArrivalTabClient({ eventId, registrations }: ArrivalTabClientProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 nb-card bg-black/5 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  const userSession = session?.user as any;
  const userRegistrations = registrations.filter((r) => r.userId === userSession?.id);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-6 nb-card bg-black/5 dark:bg-white/5 shadow-none border-dashed">
        <p className="text-lg font-black uppercase tracking-[0.2em]">Access Denied</p>
        <p className="text-xs font-bold text-gray-500 uppercase -mt-4">Personnel authentication required.</p>
        <Link href="/login">
          <Button className="nb-button bg-[#F5C518] text-black h-12 px-8">AUTHENTICATE</Button>
        </Link>
      </div>
    );
  }

  return (
    <ArrivalInputForm 
      registrations={userRegistrations} 
      eventId={eventId} 
    />
  );
}
