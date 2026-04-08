"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { logArrivalAction } from "@/app/actions/arrival-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ArrivalInputFormProps {
  registrations: any[];
  eventId: string;
}

export function ArrivalInputForm({ registrations, eventId }: ArrivalInputFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<string>("");

  async function handleSubmit(formData: FormData) {
    if (!selectedReg) return;
    
    setLoading(true);
    try {
      const result = await logArrivalAction(formData, selectedReg, eventId);
      if (result.success) {
        toast.success("VELOCITY CALCULATED", {
          description: "Bird arrival has been logged and ranking updated.",
        });
      } else {
        toast.error("TELEMETRY ERROR", {
          description: result.error || "Failed to log arrival.",
        });
      }
    } catch (error) {
      toast.error("COMMUNICATION FAILURE", {
        description: "Error connecting to server.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center nb-card border-dashed">
        <p className="text-gray-500 font-black uppercase text-sm">No registered units detected.</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Initialize registration to enable clocking.</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="registrationId" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Identify Active Unit</Label>
        <Select name="registrationId" onValueChange={(val: string | null) => setSelectedReg(val || "")} required>
          <SelectTrigger className="nb-input h-14 bg-white dark:bg-black/40">
            <SelectValue placeholder="CHOOSE BIRD SIGNAL..." />
          </SelectTrigger>
          <SelectContent className="border-[3px] border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {registrations.map((reg) => (
              <SelectItem key={reg.id} value={reg.id} className="font-black uppercase">
                {reg.bird.bandNumber} // {reg.user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="arrivalTime" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Arrival Telemetry (Date/Time)</Label>
        <Input 
          id="arrivalTime" 
          name="arrivalTime" 
          type="datetime-local" 
          className="nb-input h-14" 
          required 
        />
      </div>

      <Button 
        type="submit" 
        className="nb-button w-full bg-[#F5C518] text-black h-16 text-lg"
        disabled={loading || !selectedReg}
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin stroke-[3px]" />
            SYNCING TELEMETRY...
          </>
        ) : "LOG UNIT ARRIVAL"}
      </Button>
    </form>
  );
}
