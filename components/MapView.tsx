"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ReleaseIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const HomeIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  releasePoint: { lat: number; lon: number; name: string };
  registrations: any[];
  currentUserLoft?: any;
}

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function MapView({ releasePoint, registrations, currentUserLoft }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(`[MAP_CLIENT_DEBUG] MapView Mounted. CurrentUserLoft:`, currentUserLoft);
    setMounted(true);
  }, [currentUserLoft]);

  if (!mounted) return <div className="h-[500px] w-full bg-[#1E2A3A]/20 flex items-center justify-center text-gray-400 font-mono">INITIALIZING TELEMETRY MAP...</div>;

  const releasePos: [number, number] = [releasePoint.lat, releasePoint.lon];

  return (
    <div className="h-[600px] w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer 
        center={releasePos} 
        zoom={9} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Dark mode tile layer if available, or just standard
        />
        
        {/* Release Point (Bitawan) */}
        <Marker position={releasePos} icon={ReleaseIcon}>
          <Popup>
            <div className="p-1 min-w-[150px]">
              <div className="font-black text-black border-b-[2px] border-black pb-1 mb-2 uppercase tracking-tighter text-lg leading-none">
                DEPLOYMENT_SITE
              </div>
              <div className="font-bold text-sm text-gray-800 mb-1">{releasePoint.name}</div>
              <div className="flex flex-col gap-1 text-[10px] font-mono bg-black text-[#F5C518] p-2 mt-2">
                <span>LAT: {releasePoint.lat.toFixed(6)}</span>
                <span>LON: {releasePoint.lon.toFixed(6)}</span>
              </div>
              <div className="mt-2 text-[10px] font-black uppercase text-gray-400">Tactical_Release_Node</div>
            </div>
          </Popup>
        </Marker>

        {/* Current User Home Loft (Persistent) */}
        {currentUserLoft && (currentUserLoft.latitude !== null && currentUserLoft.latitude !== undefined) && (
          <>
            <Circle 
              center={[Number(currentUserLoft.latitude), Number(currentUserLoft.longitude)]}
              radius={100}
              pathOptions={{ color: 'violet', fillColor: 'violet', fillOpacity: 0.3 }}
            />
            <Marker 
              position={[Number(currentUserLoft.latitude), Number(currentUserLoft.longitude)]} 
              icon={HomeIcon}
            >
              <Popup>
                <div className="p-1">
                  <div className="font-black text-violet-700 uppercase tracking-widest text-[10px] bg-violet-100 px-2 py-0.5 inline-block mb-2 shadow-[2px_2px_0_0_rgba(109,40,217,0.3)]">
                    PILOT_OPERATIONS_BASE
                  </div>
                  <div className="font-bold text-sm text-gray-800">{currentUserLoft.name || "YOUR_LOFT"}</div>
                  <div className="text-[10px] font-black uppercase text-gray-400 mt-2">
                    Precision_GPS_Home_Node
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Lofts and Lines */}
        {registrations.map((reg) => {
          const loftLat = reg.bird.loftLat || reg.user.latitude;
          const loftLon = reg.bird.loftLon || reg.user.longitude;

          if (loftLat === null || loftLon === null) return null;

          const loftPos: [number, number] = [loftLat, loftLon];
          return (
            <div key={reg.id}>
              <Marker position={loftPos}>
                <Popup>
                  <div className="p-1">
                    <div className="font-black text-black uppercase tracking-widest text-[10px] bg-primary px-2 py-0.5 inline-block mb-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      RECOVERY_LOFT
                    </div>
                    <div className="font-bold text-sm text-gray-800">{reg.user.name}</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                      UNIT_ID: {reg.bird.bandNumber}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-300">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">RANGE_TELEMETRY:</span>
                      <span className="text-xs font-black text-black">{reg.distance?.toFixed(3) || "---"} KM</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
              <Polyline 
                positions={[releasePos, loftPos]} 
                color="#F5C518" 
                weight={2} 
                dashArray="5, 10"
                opacity={0.6}
              />
            </div>
          );
        })}
        
        <RecenterMap coords={releasePos} />
      </MapContainer>
    </div>
  );
}
