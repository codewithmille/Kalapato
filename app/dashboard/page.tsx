import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Shield 
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const events = await prisma.event.findMany({
    include: {
      club: true,
    },
    orderBy: {
      releaseDateTime: "desc",
    },
  });

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
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-48 text-center text-gray-500 font-black uppercase tracking-widest italic">
                    NO ACTIVE TELEMETRY FOUND
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event: any) => (
                  <TableRow key={event.id} className="border-b-[3px] border-black hover:bg-[#F5C518]/10 transition-colors">

                    <TableCell>
                      <Link href={`/events/${event.id}`}>
                        <Button className="nb-button bg-[#F5C518] text-black p-2 h-auto text-[10px] w-full">
                          DETACH
                        </Button>
                      </Link>
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
        </div>
      </main>
    </div>
  );
}

