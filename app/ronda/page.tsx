"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Plane, 
  Zap, 
  History, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { getUserRegistrations, recordArrival } from "@/app/actions/ronda-actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RondaPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selectedReg, setSelectedReg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPunching, setIsPunching] = useState(false);

  // 1. Clock Engine
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch Data
  useEffect(() => {
    async function fetchData() {
      const result = await getUserRegistrations();
      if (result.success) {
        // Filter out birds that already have an arrival log
        setRegistrations(result.registrations.filter((r: any) => !r.arrivalLog));
      } else {
        toast.error("DATA_FETCH_ERROR", { description: result.error });
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handlePunch = async () => {
    if (!selectedReg) {
      toast.error("SELECTION_REQUIRED", { description: "Identify the unit before punching." });
      return;
    }

    setIsPunching(true);
    const punchTime = new Date(); // Capture exact moment
    
    const result = await recordArrival(selectedReg, punchTime);
    
    if (result.success) {
      toast.success("PUNCH_SUCCESSFUL", { 
        description: `Bird logged at ${format(punchTime, "HH:mm:ss")}. Velocity: ${result.log.speed.toFixed(2)} m/min.` 
      });
      // Remove from list
      setRegistrations(prev => prev.filter(r => r.id !== selectedReg));
      setSelectedReg("");
    } else {
      // Offline fallback
      if (!navigator.onLine) {
        const offlinePunches = JSON.parse(localStorage.getItem("offline_punches") || "[]");
        offlinePunches.push({ registrationId: selectedReg, arrivalTime: punchTime.toISOString() });
        localStorage.setItem("offline_punches", JSON.stringify(offlinePunches));
        
        toast.warning("OFFLINE_PUNCH_CAPTURED", {
          description: "Data saved locally. Will sync when mission signal is restored."
        });
        
        setRegistrations(prev => prev.filter(r => r.id !== selectedReg));
        setSelectedReg("");
      } else {
        toast.error("PUNCH_FAILED", { description: result.error });
      }
    }
    setIsPunching(false);
  };

  // Sync offline punches when online
  useEffect(() => {
    const syncOfflinePunches = async () => {
      if (!navigator.onLine) return;
      const offlinePunches = JSON.parse(localStorage.getItem("offline_punches") || "[]");
      if (offlinePunches.length === 0) return;

      toast.info("SYNCING_OFFLINE_DATA", { description: "Restoring mission telemetry..." });

      const remainingPunches = [];
      for (const punch of offlinePunches) {
        const result = await recordArrival(punch.registrationId, new Date(punch.arrivalTime));
        if (!result.success) remainingPunches.push(punch);
      }

      localStorage.setItem("offline_punches", JSON.stringify(remainingPunches));
      if (remainingPunches.length === 0) {
        toast.success("SYNC_COMPLETE", { description: "All offline logs are now secure in HQ." });
      }
    };

    window.addEventListener("online", syncOfflinePunches);
    syncOfflinePunches(); // Check on mount
    return () => window.removeEventListener("online", syncOfflinePunches);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <div className="mb-4 inline-flex items-center gap-3 nb-badge bg-[#F5C518] text-black px-4 py-1 text-sm">
            <Zap className="h-5 w-5 stroke-[3px]" />
            <span>FIELD_OPERATIONS_ACTIVE</span>
          </div>
          <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-4 text-black dark:text-white">
            Tactical <br /> Ronda Clock
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">High-precision arrival telemetry for active racing events.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Clock & Punch Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="nb-card p-12 bg-white dark:bg-[#1E2A3A] flex flex-col items-center justify-center text-center">
              <div className="mb-6 inline-flex items-center gap-2 nb-badge bg-black text-[#F5C518] px-3 py-1 text-xs">
                <Clock className="h-4 w-4 stroke-[3px]" />
                SYSTEM_TIME_SYNC
              </div>
              
              <div className="text-5xl sm:text-[8rem] md:text-[12rem] font-black tabular-nums leading-none tracking-tighter text-black dark:text-white">
                {format(currentTime, "HH:mm:ss")}
              </div>
              
              <div className="mt-4 text-sm sm:text-2xl font-black uppercase text-gray-400">
                {format(currentTime, "EEEE, MMMM dd, yyyy")}
              </div>
            </div>

            <div className="nb-card p-6 sm:p-10 bg-[#F5C518]">
              <h3 className="mb-6 text-xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-3">
                <Plane className="h-8 w-8 stroke-[3px]" />
                Identify Arrival Unit
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  <select 
                    value={selectedReg}
                    onChange={(e) => setSelectedReg(e.target.value)}
                    disabled={isLoading || registrations.length === 0}
                    className="nb-input h-20 w-full appearance-none bg-white text-2xl font-black uppercase px-6 cursor-pointer disabled:opacity-50"
                  >
                    <option value="">-- SELECT_UNIT_TAG --</option>
                    {registrations.map((reg) => (
                      <option key={reg.id} value={reg.id}>
                        {reg.bird.bandNumber} - {reg.event.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 pointer-events-none" />
                </div>

                  <Button 
                    onClick={handlePunch}
                    disabled={isPunching || !selectedReg || registrations.length === 0}
                    className="nb-button w-full h-16 sm:h-24 bg-black text-[#F5C518] text-xl sm:text-4xl font-black uppercase tracking-tighter hover:bg-[#111]"
                  >
                  {isPunching ? (
                    <>
                      <Loader2 className="mr-4 h-10 w-10 animate-spin stroke-[4px]" />
                      LOGGING...
                    </>
                  ) : (
                    "COMMENCE_PUNCH"
                  )}
                </Button>
                
                {registrations.length === 0 && !isLoading && (
                  <div className="flex items-center gap-3 text-black/60 font-black uppercase text-xs">
                    <AlertTriangle className="h-5 w-5" />
                    No active registrations found for mission telemetry.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines & Recent Punches (Static/Mock for now) */}
          <div className="space-y-6">
            <div className="nb-card p-8 bg-black text-white">
              <History className="h-10 w-10 mb-4 stroke-[3px] text-[#F5C518]" />
              <h3 className="text-xl font-black uppercase mb-6 tracking-tight">Recent Telemetry</h3>
              
              <div className="space-y-4">
                <div className="border-l-[4px] border-[#F5C518] pl-4 py-1">
                  <p className="text-[10px] font-black text-gray-500">READY_FOR_DATA</p>
                  <p className="text-sm font-bold uppercase tracking-widest italic">Waiting for unit arrival...</p>
                </div>
              </div>
            </div>

            <div className="nb-card p-8 bg-white dark:bg-[#1E2A3A]">
              <CheckCircle2 className="h-10 w-10 mb-4 stroke-[3px] text-green-500" />
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Ronda Protocol</h3>
              <ul className="space-y-4 text-xs font-bold uppercase leading-tight text-gray-500">
                <li className="flex gap-2">
                  <span className="text-black font-black">01.</span>
                  Ensure visual confirmation of unit touchdown before punching.
                </li>
                <li className="flex gap-2">
                  <span className="text-black font-black">02.</span>
                  The system captures the exact millisecond of the "Commence_Punch" action.
                </li>
                <li className="flex gap-2">
                  <span className="text-black font-black">03.</span>
                  Data is synced via military-grade server actions to the cloud.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
