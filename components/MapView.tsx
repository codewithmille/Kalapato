"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  releasePoint: { lat: number; lon: number; name: string };
  registrations: any[];
}

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function MapView({ releasePoint, registrations }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        
        {/* Release Point */}
        <Marker position={releasePos}>
          <Popup>
            <div className="font-bold text-[#0A0F1E] uppercase">RELEASE POINT</div>
            <div className="text-xs">{releasePoint.name}</div>
          </Popup>
        </Marker>

        {/* Lofts and Lines */}
        {registrations.map((reg) => {
          const loftPos: [number, number] = [reg.bird.loftLat, reg.bird.loftLon];
          return (
            <div key={reg.id}>
              <Marker position={loftPos}>
                <Popup>
                  <div className="font-bold text-[#0A0F1E] uppercase">LOFT: {reg.user.name}</div>
                  <div className="text-xs">Bird: {reg.bird.bandNumber}</div>
                  <div className="text-xs mt-1 font-bold">Distance: {reg.distance?.toFixed(3)} km</div>
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
