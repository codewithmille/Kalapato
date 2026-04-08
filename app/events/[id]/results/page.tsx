import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Download, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SpeedChart } from "@/components/SpeedChart";
import { Leaderboard } from "@/components/Leaderboard";

export default async function EventResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
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

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b-[4px] border-black pb-8">
          <div>
            <Link href={`/events/${event.id}`} className="mb-6 flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 stroke-[3px]" />
              BACK TO MISSION DETAILS
            </Link>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-[0.8] mb-4">
              Results <span className="text-[#F5C518]">Telemetry</span>
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{event.name} Official Classification</p>
          </div>
          
          <Button className="nb-button bg-white dark:bg-black text-black dark:text-white h-14 px-8 font-black uppercase tracking-tight">
            <Download className="mr-2 h-5 w-5 stroke-[3px]" />
            EXPORT_LOGS.CSV
          </Button>
        </div>

        <div className="grid gap-12">
          <div className="nb-card p-8 bg-white dark:bg-[#1E2A3A]">
            <div className="mb-8 border-b-[3px] border-black pb-4">
              <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-[#F5C518] stroke-[3px]" />
                Velocity Spectrum
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">METERS_PER_MINUTE // TOP_10_UNITS</p>
            </div>
            <div className="h-[400px]">
              <SpeedChart data={event.registrations} />
            </div>
          </div>

          <div className="nb-card p-8 bg-white dark:bg-[#1E2A3A]">
             <div className="mb-8 border-b-[3px] border-black pb-4">
              <h2 className="text-3xl font-black uppercase flex items-center gap-3">
                <Award className="h-8 w-8 text-[#F5C518] stroke-[3px]" />
                Final Classification
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">SECURE_VERIFIED_INTEL</p>
            </div>
            <Leaderboard registrations={event.registrations} />
          </div>
        </div>
      </main>
    </div>
  );
}
