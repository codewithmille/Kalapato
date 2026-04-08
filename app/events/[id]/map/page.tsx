import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import Link from "next/link";
import MapClientLoader from "@/components/MapClientLoader";

export default async function EventMapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          bird: true,
          user: true,
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const releasePoint = {
    lat: event.releaseLat,
    lon: event.releaseLon,
    name: event.releaseLocationName,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <Link href={`/events/${event.id}`} className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 stroke-[3px]" />
            BACK TO MISSION DETAILS
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center border-[4px] border-black bg-[#F5C518] shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <MapIcon className="h-10 w-10 stroke-[3px]" />
              </div>
              <div>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
                  Flight <span className="text-[#F5C518]">Path</span>
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{event.name} // {event.releaseLocationName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="nb-card p-4 bg-white dark:bg-black/20">
          <MapClientLoader 
            releasePoint={releasePoint} 
            registrations={event.registrations} 
          />
        </div>
      </main>
    </div>
  );
}
