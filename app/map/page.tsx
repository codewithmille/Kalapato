import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Activity } from "lucide-react";
import MapClientLoader from "@/components/MapClientLoader";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function GlobalMapPage() {
  let events: any[] = [];
  let userProfile: any = null;

  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const profileData = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { latitude: true, longitude: true, name: true }
      });
      
      if (profileData) {
        userProfile = {
          latitude: profileData.latitude !== null ? Number(profileData.latitude) : null,
          longitude: profileData.longitude !== null ? Number(profileData.longitude) : null,
          name: profileData.name
        };
        console.log(`[MAP_DATA_DEBUG] Parsed User Profile for ${session.user.email}:`, userProfile);
      }
    }

    events = await prisma.event.findMany({
      where: {
        status: "ACTIVE"
      },
      include: {
        registrations: {
          include: {
            bird: true,
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("BUILD_TIME_DB_FETCH_SKIP: Connection unavailable.");
  }

  const defaultCenter = events.length > 0 
    ? { lat: events[0].releaseLat, lon: events[0].releaseLon, name: events[0].name }
    : { lat: 13.6218, lon: 123.1875, name: "CENTRAL COMMAND" };

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <div className="mb-4 inline-flex items-center gap-3 nb-badge bg-[#F5C518] text-black px-4 py-1 text-sm">
            <Activity className="h-5 w-5 stroke-[3px]" />
            <span>GLOBAL_TACTICAL_TELEMETRY</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4 text-black dark:text-white">
            Theater <br /> Dashboard
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Live flight path monitoring across all active missions</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 nb-card p-4 bg-white dark:bg-black/20">
            <MapClientLoader 
              releasePoint={defaultCenter} 
              registrations={events.flatMap(e => e.registrations)} 
              currentUserLoft={userProfile}
            />
          </div>
          
          <div className="space-y-6">
            <div className="nb-card p-6 bg-black text-white">
              <h3 className="text-xl font-black uppercase mb-4 text-[#F5C518]">Active Sectors</h3>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-xs font-bold text-gray-500 uppercase italic">No active sectors detected.</p>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="border-l-[4px] border-[#F5C518] pl-4 py-1">
                      <p className="font-black uppercase text-sm">{event.name}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{event.releaseLocationName}</p>
                      <p className="text-[10px] font-black text-[#F5C518] mt-1">{event.registrations.length} UNITS_IN_AIR</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="nb-card p-6 bg-[#F5C518] text-black">
              <h3 className="text-xl font-black uppercase mb-2">Tactical Info</h3>
              <p className="text-[10px] font-black uppercase leading-tight">
                Map displaying verified GPS telemetry for all units registered in active flight missions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
