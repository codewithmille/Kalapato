import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/app/actions/event-actions";
import { ArrowLeft, Flag } from "lucide-react";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 stroke-[3px]" />
            Back to Flight Ops
          </Link>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4">
            New <span className="text-[#F5C518]">Mission</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Initialize official racing event parameters</p>
        </div>

        <div className="nb-card p-10 bg-white dark:bg-[#1E2A3A] w-full">
          <div className="mb-8 flex items-center gap-4 border-b-[3px] border-black pb-4">
            <div className="flex h-12 w-12 items-center justify-center border-[3px] border-black bg-[#F5C518] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
              <Flag className="h-6 w-6 stroke-[3px]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Mission Constraints</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase">Operational requirements for calculation</p>
            </div>
          </div>

          <form action={createEventAction} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Race Name / Event ID</Label>
                <Input name="name" placeholder="E.G. CASIGURAN SDR 2026" className="nb-input h-14" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Organizing Club</Label>
                <Input name="clubName" placeholder="E.G. PILI PIGEON CLUB" className="nb-input h-14" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Mission Description</Label>
              <Textarea name="description" placeholder="BRIEF OVERVIEW OF THE FLIGHT MISSION..." className="nb-input min-h-[120px]" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Release Point</Label>
                <Input name="releaseLocationName" placeholder="CASIGURAN SORSOGON" className="nb-input h-14" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Lat_Coord</Label>
                <Input name="releaseLat" type="number" step="0.000001" placeholder="12.8719" className="nb-input h-14" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Lon_Coord</Label>
                <Input name="releaseLon" type="number" step="0.000001" placeholder="124.0133" className="nb-input h-14" required />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Launch Schedule (Date/Time)</Label>
                <Input name="releaseDateTime" type="datetime-local" className="nb-input h-14" required />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Reg_Lock_In (Deadline)</Label>
                <Input name="registrationDeadline" type="datetime-local" className="nb-input h-14" required />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Min_Velocity (M/MIN)</Label>
                <Input name="minSpeed" type="number" defaultValue="700" className="nb-input h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Mission_Type</Label>
                <Input name="lapType" placeholder="OPEN / SPRINT" className="nb-input h-14" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Pooling_Strata</Label>
                <Input name="poolingAmounts" placeholder="20, 50, 100" className="nb-input h-14" />
              </div>
            </div>

            <Button type="submit" className="nb-button w-full bg-[#F5C518] text-black h-20 text-xl">
              INITIALIZE FLIGHT MISSION
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
