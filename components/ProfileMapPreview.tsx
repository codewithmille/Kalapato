"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ProfileMapPreviewProps {
  lat: number;
  lon: number;
}

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function ProfileMapPreview({ lat, lon }: ProfileMapPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(`[PROFILE_MAP_DEBUG] Component Mounted. Received: Lat ${lat}, Lon ${lon}`);
    setMounted(true);
  }, [lat, lon]);

  if (!mounted) {
    return (
      <div className="h-[300px] w-full bg-gray-200 flex items-center justify-center text-gray-500 font-mono border-[3px] border-black">
        <div className="animate-pulse">INITIALIZING_TACTICAL_DATA...</div>
      </div>
    );
  }

  const position: [number, number] = [lat, lon];
  console.log(`[PROFILE_MAP_DEBUG] Rendering position:`, position);

  return (
    <div 
      className="w-full relative rounded-xl overflow-hidden border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-[#f0f0f0]"
      style={{ height: '300px', minHeight: '300px' }}
    >
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "300px", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <RecenterMap coords={position} />
      </MapContainer>
    </div>
  );
}
