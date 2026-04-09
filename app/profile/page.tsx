"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Navigation, 
  Save, 
  Loader2, 
  ShieldCheck,
  Compass,
  Radar
} from "lucide-react";
import { updateProfileCoordinates, getUserProfile } from "@/app/actions/user-actions";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("@/components/ProfileMapPreview"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-100 animate-pulse flex items-center justify-center border-[3px] border-black border-dashed">
      <Radar className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  )
});

export default function ProfilePage() {
  const { data: session } = useSession();
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getUserProfile();
        if (result.success && result.user) {
          if (result.user.latitude !== null) setLat(result.user.latitude.toString());
          if (result.user.longitude !== null) setLon(result.user.longitude.toString());
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsInitialLoading(false);
      }
    }

    if (session?.user) {
      loadProfile();
    }
  }, [session]);

  // Initialize from session if available (though session might not have lat/lon yet)
  // We'll trust the user to fetch or enter them manually for the first time.

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("GPS_UNSUPPORTED", {
        description: "Your browser does not support Geolocation services.",
      });
      return;
    }

    setIsFetchingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLon(position.coords.longitude.toFixed(6));
        setIsFetchingGps(false);
        toast.success("GPS_SIGNAL_LOCKED", {
          description: "Current coordinates have been precision-captured.",
        });
      },
      (error) => {
        setIsFetchingGps(false);
        toast.error("GPS_ERROR", {
          description: "Failed to lock onto satellite signal.",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSave = async () => {
    if (!lat || !lon) {
      toast.error("DATA_INCOMPLETE", {
        description: "Latitude and Longitude parameters are required.",
      });
      return;
    }

    setIsSaving(true);
    const result = await updateProfileCoordinates(parseFloat(lat), parseFloat(lon));
    
    if (result.success) {
      toast.success("DATABASE_SYNCED", {
        description: "Default loft coordinates updated in pilot profile.",
      });
    } else {
      toast.error("SYNC_FAILED", {
        description: result.error || "Failed to update profile.",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12 border-b-[4px] border-black pb-8">
          <div className="mb-4 inline-flex items-center gap-3 nb-badge bg-[#F5C518] text-black px-4 py-1 text-sm">
            <Compass className="h-5 w-5 stroke-[3px]" />
            <span>PILOT_PROFILE_SYSTEM</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-[0.8] mb-4 text-black dark:text-white">
            Operational <br /> Intelligence
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Configure default flight path parameters and loft location</p>
        </div>

        {isInitialLoading ? (
          <div className="nb-card p-20 flex flex-col items-center justify-center bg-white dark:bg-[#1E2A3A]">
            <Loader2 className="h-16 w-16 animate-spin text-primary stroke-[3px] mb-6" />
            <p className="text-xl font-black uppercase tracking-tighter">Retrieving Personnel Data...</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 nb-card p-10 bg-white dark:bg-[#1E2A3A]">
              <div className="mb-8 flex items-center gap-4 border-b-[3px] border-black pb-4">
                <div className="flex h-12 w-12 items-center justify-center border-[3px] border-black bg-[#F5C518] shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                  <Navigation className="h-6 w-6 stroke-[3px]" />
                </div>
                <h3 className="text-2xl font-black uppercase">Home Loft Coordinates</h3>
              </div>

              <div className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase bg-black/5 dark:bg-black p-2 block w-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      LOFT_LATITUDE
                    </Label>
                    <Input 
                      type="number" 
                      step="0.000001"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="e.g. 13.6218" 
                      className="nb-input h-16 text-xl font-mono" 
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black tracking-widest text-black dark:text-[#F5C518] uppercase bg-black/5 dark:bg-black p-2 block w-fit shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      LOFT_LONGITUDE
                    </Label>
                    <Input 
                      type="number" 
                      step="0.000001"
                      value={lon}
                      onChange={(e) => setLon(e.target.value)}
                      placeholder="e.g. 123.1875" 
                      className="nb-input h-16 text-xl font-mono" 
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="text-[10px] font-black uppercase tracking-widest text-black/60 mb-4 flex items-center gap-2">
                    <Radar className="h-4 w-4" />
                    Visual_Tactical_Preview
                  </div>
                  <MapPreview 
                    lat={parseFloat(lat) || 13.6218} 
                    lon={parseFloat(lon) || 123.1875} 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                  <Button 
                    onClick={handleGetLocation}
                    disabled={isFetchingGps}
                    className="nb-button bg-[#F5C518] text-black flex-1 h-16 text-lg font-black"
                  >
                    {isFetchingGps ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin stroke-[3px]" />
                        CAPTURING_SIGNAL...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-3 h-6 w-6 stroke-[3px]" />
                        LOCK_GPS_SIGNAL
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="nb-button bg-black text-white dark:bg-white dark:text-black flex-1 h-16 text-lg font-black"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin stroke-[3px]" />
                        SAVING...
                      </>
                    ) : (
                      <>
                        <Save className="mr-3 h-6 w-6 stroke-[3px]" />
                        DATA_COMMIT
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="nb-card p-8 bg-[#F5C518] text-black">
                <ShieldCheck className="h-10 w-10 mb-4 stroke-[3px]" />
                <h3 className="text-xl font-black uppercase mb-2">Protocol Note</h3>
                <p className="text-xs font-bold leading-relaxed uppercase">
                  Synchronizing your home loft coordinates here will allow the system to automatically calculate mission distance relative to your registered unit base.
                </p>
              </div>
              
              <div className="nb-card p-8 bg-black text-white">
                <h3 className="text-[10px] font-black text-[#F5C518] uppercase mb-1 tracking-widest">PERSONNEL_ID</h3>
                <p className="font-mono text-sm mb-4 truncate">{session?.user?.email}</p>
                <h3 className="text-[10px] font-black text-[#F5C518] uppercase mb-1 tracking-widest">CLEARANCE_LEVEL</h3>
                <p className="font-black uppercase text-xl">MEMBER_ACTIVE</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
