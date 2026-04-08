"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { registerBirdAction } from "@/app/actions/bird-actions";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface BirdRegistrationFormProps {
  eventId: string;
  defaultLat?: number;
  defaultLon?: number;
}

export function BirdRegistrationForm({ eventId, defaultLat, defaultLon }: BirdRegistrationFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFetchingGps, setIsFetchingGps] = useState(false);

  // Controlled inputs for coordinates
  const [lat, setLat] = useState<string>(defaultLat?.toString() || "");
  const [lon, setLon] = useState<string>(defaultLon?.toString() || "");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("GPS_UNSUPPORTED");
      return;
    }

    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLon(position.coords.longitude.toFixed(6));
        setIsFetchingGps(false);
        toast.success("GPS_LOCKED");
      },
      () => {
        setIsFetchingGps(false);
        toast.error("GPS_FAILED");
      },
      { enableHighAccuracy: true }
    );
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const result = await registerBirdAction(formData, eventId);
      if (result.success) {
        setSuccess(true);
        toast.success("MISSION REGISTERED", {
          description: "Bird telemetry has been uploaded to the dashboard.",
        });
      } else {
        toast.error("REGISTRATION FAILED", {
          description: result.error || "An unknown error occurred.",
        });
      }
    } catch (error) {
      toast.error("REGISTRATION FAILED", {
        description: "Failed to connect to operation command.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center nb-card bg-green-500/10 border-green-500 shadow-none">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4 stroke-[3px]" />
        <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tighter">Mission Active</h3>
        <p className="text-xs font-bold text-gray-500 mt-2 uppercase">Unit telemetry has been initialized.</p>
        <Button
          variant="link"
          onClick={() => setSuccess(false)}
          className="text-black dark:text-[#F5C518] mt-6 font-black uppercase text-xs underline decoration-[3px]"
        >
          Register Another Unit
        </Button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bandNumber" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Band_ID</Label>
          <Input id="bandNumber" name="bandNumber" placeholder="PHI-2025-000000" className="nb-input h-14" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerName" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Commander</Label>
          <Input id="ownerName" name="ownerName" placeholder="Juan Dela Cruz" className="nb-input h-14" required />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="color" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Aero_Color</Label>
          <Input id="color" name="color" placeholder="Blue Bar" className="nb-input h-14" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sex" className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase">Unit_Type</Label>
          <Select name="sex">
            <SelectTrigger className="nb-input h-14 bg-white dark:bg-black/40">
              <SelectValue placeholder="CHOOSE..." />
            </SelectTrigger>
            <SelectContent className="border-[3px] border-black rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <SelectItem value="Cock" className="font-black uppercase">Alpha (Cock)</SelectItem>
              <SelectItem value="Hen" className="font-black uppercase">Beta (Hen)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t-[3px] border-black">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black tracking-[0.2em] text-[#F5C518] uppercase bg-black px-2 py-0.5 w-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Base_Coordinates</div>
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={isFetchingGps}
            className="nb-button bg-[#F5C518] text-black h-8 text-[10px] font-black px-4"
          >
            {isFetchingGps ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <MapPin className="h-3 w-3 mr-2" />}
            USE_DEVICE_GPS
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="loftLat" className="text-[10px] font-black text-gray-500 uppercase">Latitude</Label>
            <Input
              id="loftLat"
              name="loftLat"
              type="number"
              step="0.000001"
              placeholder="13.5941"
              className="nb-input h-14"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loftLon" className="text-[10px] font-black text-gray-500 uppercase">Longitude</Label>
            <Input
              id="loftLon"
              name="loftLon"
              type="number"
              step="0.000001"
              placeholder="123.2977"
              className="nb-input h-14"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
            />
          </div>
        </div>
      </div>


      <Button
        type="submit"
        className="nb-button w-full bg-[#F5C518] text-black h-16 text-lg"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-3 h-6 w-6 animate-spin stroke-[3px]" />
            TRANSMITTING...
          </>
        ) : "CONFIRM MISSION DEPLOYMENT"}
      </Button>
    </form>
  );
}
