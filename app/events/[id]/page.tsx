import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { 
  Trophy, 
  MapPin, 
  Clock, 
  ArrowLeft,
  Bird as BirdIcon,
  Timer,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaderboard } from "@/components/Leaderboard";
import { BirdRegistrationForm } from "@/components/BirdRegistrationForm";
import { ArrivalTabClient } from "@/components/ArrivalTabClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  let event: any = null;
  try {
    event = await prisma.event.findUnique({
      where: { id },
      include: {
        club: true,
        registrations: {
          include: {
            bird: true,
            user: true,
            arrivalLog: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("BUILD_TIME_DB_FETCH_SKIP: Connection unavailable.");
  }

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 stroke-[3px]" />
            Back to Flight Ops
          </Link>
          
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="nb-badge bg-[#F5C518] text-black">MISSION_LIVE</span>
                <span className="text-sm font-black tracking-[0.2em] text-[#F5C518] uppercase bg-black px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  {event.club.name}
                </span>
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8]">
                {event.name}
              </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:flex md:gap-8">
              <div className="nb-card p-4 flex flex-col bg-white dark:bg-black/40 min-w-[140px]">
                <span className="text-[10px] font-black tracking-widest text-[#F5C518] uppercase mb-1">Release Pt</span>
                <span className="font-black uppercase flex items-center gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 stroke-[3px]" />
                  {event.releaseLocationName}
                </span>
              </div>
              <div className="nb-card p-4 flex flex-col bg-white dark:bg-black/40 min-w-[140px]">
                <span className="text-[10px] font-black tracking-widest text-[#F5C518] uppercase mb-1">Launch Time</span>
                <span className="font-black uppercase flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 stroke-[3px]" />
                  {format(new Date(event.releaseDateTime), "HH:mm")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-12">
          <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-3 border-none">
            <TabsTrigger value="leaderboard" className="nb-button px-6 py-3 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black bg-white dark:bg-black text-gray-500 font-black uppercase">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="register" className="nb-button px-6 py-3 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black bg-white dark:bg-black text-gray-500 font-black uppercase">
              <BirdIcon className="mr-2 h-4 w-4" />
              Register Unit
            </TabsTrigger>
            <TabsTrigger value="arrival" className="nb-button px-6 py-3 data-[state=active]:bg-[#F5C518] data-[state=active]:text-black bg-white dark:bg-black text-gray-500 font-black uppercase">
              <Timer className="mr-2 h-4 w-4" />
              Clock Arrival
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="nb-card p-8">
              <div className="mb-8 flex items-center justify-between border-b-[3px] border-black pb-4">
                <div>
                  <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-[#F5C518]" />
                    Live Rankings
                  </h2>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">Real-time velocity telemetry</p>
                </div>
              </div>
              <Leaderboard registrations={event.registrations} />
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="nb-card p-8">
                <h2 className="text-3xl font-black uppercase flex items-center gap-3 mb-6">
                  <BirdIcon className="h-8 w-8 text-[#F5C518]" />
                  Unit Sign-in
                </h2>
                {(() => {
                  const userCoords = event.registrations.find((r: any) => r.userId === (session?.user as any)?.id)?.user || null;
                  return (
                    <BirdRegistrationForm 
                      eventId={event.id} 
                      defaultLat={(userCoords as any)?.latitude || undefined}
                      defaultLon={(userCoords as any)?.longitude || undefined}
                    />
                  );
                })()}
              </div>

              
              <div className="space-y-8">
                <div className="nb-card p-6 bg-[#F5C518] text-black">
                  <h3 className="text-xl font-black uppercase mb-4">Mission Brief</h3>
                  <div className="text-sm font-bold space-y-4 uppercase leading-tight">
                    <p>
                      Telemetry is calculated relative to <span className="underline decoration-[3px]">{event.releaseLocationName}</span>.
                    </p>
                    <div className="nb-card bg-black/10 border-black p-4 shadow-none">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black">LATITUDE</p>
                          <p className="font-mono text-lg">{event.releaseLat}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black">LONGITUDE</p>
                          <p className="font-mono text-lg">{event.releaseLon}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="arrival">
            <div className="nb-card p-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-black uppercase flex items-center gap-3 mb-2">
                <Timer className="h-8 w-8 text-[#F5C518]" />
                Clock Terminal
              </h2>
              <p className="text-sm font-bold text-gray-500 uppercase mb-8">
                Secure entry for personnel birds.
              </p>
              
              <ArrivalTabClient 
                eventId={event.id} 
                registrations={event.registrations} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
