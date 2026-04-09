"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Shield,
  Zap,
  Loader2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getAllEvents, updateEvent } from "@/app/actions/ronda-actions";
import { toast } from "sonner";

export default function DashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [editingMission, setEditingMission] = useState<any>(null);
  const [missionName, setMissionName] = useState("");
  const [missionStatus, setMissionStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    setIsLoading(true);
    const result = await getAllEvents();
    if (result.success) {
      setEvents(result.events);
    } else {
      toast.error("MISSION_FETCH_FAILURE", { description: result.error });
    }
    setIsLoading(false);
  };

  const handleEditInitiate = (event: any) => {
    setEditingMission(event);
    setMissionName(event.name);
    setMissionStatus(event.status);
  };

  const handleUpdateMission = async () => {
    if (!editingMission) return;
    setIsUpdating(true);
    const result = await updateEvent(editingMission.id, {
      name: missionName,
      description: editingMission.description,
      status: missionStatus
    });

    if (result.success) {
      toast.success("MISSION_OVERRIDDEN", { description: "Metadata updated successfully." });
      setEditingMission(null);
      fetchMissions();
    } else {
      toast.error("OVERRIDE_FAILURE", { description: result.error });
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.8]">
              Flight Ops
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-4">
              Mission Control / Unit Dashboard
            </p>
          </div>
          
          <Link href="/admin/events/new">
            <Button className="nb-button bg-[#F5C518] text-black h-16 px-8 text-lg">
              <Plus className="mr-2 h-6 w-6 stroke-[3px]" />
              INITIALIZE MISSION
            </Button>
          </Link>
        </div>

        <div className="nb-card overflow-hidden">
          <Table>
            <TableHeader className="bg-black text-white">
              <TableRow className="hover:bg-transparent border-b-[3px] border-black">
                <TableHead className="w-[100px] text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Actions</TableHead>
                <TableHead className="w-[80px] text-[12px] font-black tracking-widest text-[#F5C518] uppercase text-center">SEC</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">ID_TAG</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Club_Org</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Mission_Name</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Release_Point</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Launch_Time</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest text-[#F5C518] uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-[#1E2A3A]">
              {events.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center text-gray-500 font-black uppercase tracking-widest italic">
                    NO ACTIVE TELEMETRY FOUND
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event: any) => (
                  <TableRow key={event.id} className="border-b-[3px] border-black hover:bg-[#F5C518]/10 transition-colors">

                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/events/${event.id}`} className="flex-1">
                          <Button className="nb-button bg-[#F5C518] text-black p-2 h-auto text-[10px] w-full">
                            DETACH
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => handleEditInitiate(event)}
                          className="nb-button bg-black text-white p-2 h-auto text-[10px] flex-1 border-black"
                        >
                          EDIT
                        </Button>
                      </div>
                    </TableCell>


                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Shield className="h-5 w-5 text-green-600 stroke-[3px]" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-black">
                      #{event.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-black uppercase tracking-tighter">
                      {event.club.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-lg leading-tight uppercase">{event.name}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{event.lapType || "STANDARD_OPS"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-black uppercase">
                        <MapPin className="h-4 w-4 text-black dark:text-[#F5C518] stroke-[3px]" />
                        {event.releaseLocationName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-black uppercase">
                        <Calendar className="h-4 w-4 text-black dark:text-[#F5C518] stroke-[3px]" />
                        {format(new Date(event.releaseDateTime), "MMM dd / HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span 
                        className={cn(
                          "nb-badge inline-block",
                          event.status === "ACTIVE" ? "bg-green-500 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :
                          event.status === "DONE" ? "bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :
                          "bg-gray-500 text-white"
                        )}
                      >
                        {event.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {isLoading && (
            <div className="flex h-32 items-center justify-center bg-white dark:bg-[#1E2A3A]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
        </div>
      </main>

      {/* MISSION_OVERRIDE_MODAL */}
      {editingMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="nb-card w-full max-w-md bg-white p-8 animate-in zoom-in duration-200 border-[4px] border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <div className="mb-6 flex items-center justify-between border-b-[4px] border-black pb-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2 text-black">
                <Zap className="h-6 w-6 fill-[#F5C518]" />
                Mission_Override
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setEditingMission(null)}
                className="h-10 w-10 p-0 border-[3px] border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white"
              >
                X
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">MISSION_NAME</label>
                <input 
                  type="text"
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  className="nb-input w-full h-14 text-sm font-black uppercase px-4 bg-gray-50"
                  placeholder="ENTER_NEW_MISSION_NAME"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/60">DEPLOYMENT_STATUS</label>
                <select 
                  value={missionStatus}
                  onChange={(e) => setMissionStatus(e.target.value)}
                  className="nb-input w-full h-14 text-sm font-black uppercase px-4 bg-white"
                >
                  <option value="ACTIVE">ACTIVE_OPS</option>
                  <option value="DONE">MISSION_COMPLETE</option>
                  <option value="PENDING">STAGING</option>
                </select>
              </div>
              
              <div className="nb-card bg-[#FFFEE0] p-4 text-[10px] font-bold uppercase leading-tight text-gray-700 flex gap-3 border-gray-200 shadow-none">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                Changing mission metadata will affect all connected unit telemetry and live leaderboards.
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  onClick={() => setEditingMission(null)}
                  variant="outline"
                  className="nb-button flex-1 h-14 border-black text-black font-black uppercase"
                >
                  ABORT
                </Button>
                <Button 
                  onClick={handleUpdateMission}
                  disabled={isUpdating}
                  className="nb-button flex-1 h-14 bg-black text-white font-black uppercase"
                >
                  {isUpdating ? <Loader2 className="animate-spin h-5 w-5" /> : "APPLY_CHANGES"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
