import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
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
  MapPin, 
  Calendar, 
  Shield,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      include: {
        club: true,
      },
      orderBy: {
        releaseDateTime: "desc",
      },
    });
  } catch (error) {
    console.error("BUILD_TIME_DB_FETCH_SKIP: Connection unavailable.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <div className="mb-4 inline-flex items-center gap-3 nb-badge bg-[#F5C518] text-black px-4 py-1 text-sm">
            <Trophy className="h-5 w-5 stroke-[3px]" />
            <span>MISSION_CHARTING_ACTIVE</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4 text-black dark:text-white">
            Available <br /> Missions
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Official racing events and unit registrations</p>
        </div>

        <div className="nb-card overflow-hidden">
          <Table>
            <TableHeader className="bg-black text-[#F5C518]">
              <TableRow className="hover:bg-transparent border-b-[3px] border-black">
                <TableHead className="w-[120px] text-[12px] font-black tracking-widest uppercase">Personnel_Ctrl</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest uppercase">Race_Event_ID</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest uppercase">Club_Org</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest uppercase">Release_Point</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest uppercase">Launch_Time</TableHead>
                <TableHead className="text-[12px] font-black tracking-widest uppercase text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-[#1E2A3A]">
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-gray-400 font-black uppercase tracking-widest italic">
                    NO ACTIVE MISSIONS IN DATASET
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event: any) => (
                  <TableRow key={event.id} className="border-b-[3px] border-black hover:bg-[#F5C518]/10 transition-colors group">
                    <TableCell>
                      <Link href={`/events/${event.id}`}>
                        <Button className="nb-button bg-[#F5C518] text-black w-full h-10 text-[10px] font-black">
                          OPEN MISSION
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-lg leading-tight uppercase group-hover:text-[#F5C518] transition-colors">{event.name}</span>
                        <span className="font-mono text-[10px] text-gray-500">{event.id.slice(0, 12).toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black uppercase text-xs">
                      {event.club.name}
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
                        {format(new Date(event.releaseDateTime), "PPPP @ HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
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
        </div>
      </main>
    </div>
  );
}
