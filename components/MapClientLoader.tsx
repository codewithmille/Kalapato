"use client";

import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";

// Dynamic import for Leaflet (client-side only)
const MapView = dynamic(() => import("@/components/MapView"), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-white dark:bg-black/20 flex flex-col items-center justify-center text-gray-400 font-mono nb-card shadow-none border-dashed">
      <div className="animate-pulse flex flex-col items-center">
        <MapIcon className="h-12 w-12 mb-4 stroke-[2px]" />
        <span className="font-black uppercase tracking-widest text-xs tracking-[0.2em]">INITIALIZING_TACTICAL_MAP...</span>
      </div>
    </div>
  )
});

interface MapClientLoaderProps {
  releasePoint: { lat: number; lon: number; name: string };
  registrations: any[];
}

export default function MapClientLoader({ releasePoint, registrations }: MapClientLoaderProps) {
  return (
    <MapView 
      releasePoint={releasePoint} 
      registrations={registrations} 
    />
  );
}
