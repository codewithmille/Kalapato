"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatSpeed, formatDistance } from "@/lib/calculator";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  registrations: any[];
}

export function Leaderboard({ registrations }: LeaderboardProps) {
  // Sort registrations by speed descending
  const sortedArr = [...registrations].sort((a, b) => {
    const speedA = a.arrivalLog?.speed || 0;
    const speedB = b.arrivalLog?.speed || 0;
    return speedB - speedA;
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-black text-white">
          <TableRow className="border-b-[4px] border-black hover:bg-transparent">
            <TableHead className="w-[80px] text-center font-black uppercase text-[#F5C518]">Pos</TableHead>
            <TableHead className="font-black uppercase text-[#F5C518]">Identification</TableHead>
            <TableHead className="font-black uppercase text-[#F5C518]">Fancier</TableHead>
            <TableHead className="font-black uppercase text-[#F5C518] text-right">Distance</TableHead>
            <TableHead className="font-black uppercase text-[#F5C518] text-right">Velocity</TableHead>
            <TableHead className="font-black uppercase text-[#F5C518] text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-[#1E2A3A]">
          {sortedArr.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-gray-500 font-black uppercase tracking-widest">
                Awaiting mission telemetry...
              </TableCell>
            </TableRow>
          ) : (
            sortedArr.map((reg, index) => {
              const isArrival = reg.arrivalLog;
              const rank = index + 1;
              const isPodium = rank <= 3 && isArrival;

              return (
                <TableRow key={reg.id} className="border-b-[3px] border-black group hover:bg-[#F5C518]/10 transition-colors">
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <span className={cn(
                        "nb-badge px-3 py-1 text-sm",
                        rank === 1 ? "bg-yellow-400 text-black" : 
                        rank === 2 ? "bg-gray-300 text-black" : 
                        rank === 3 ? "bg-amber-600 text-white" : 
                        "bg-black text-white"
                      )}>
                        {rank}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        {isPodium && <Trophy className="h-4 w-4 text-[#F5C518] stroke-[3px]" />}
                        <span className="font-black uppercase text-lg">{reg.bird.bandNumber}</span>
                     </div>
                  </TableCell>
                  <TableCell className="font-bold uppercase text-xs tracking-tight">{reg.user.name}</TableCell>
                  <TableCell className="text-right font-mono font-black">
                    {reg.distance ? formatDistance(reg.distance) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {isArrival ? (
                      <span className="font-mono font-black text-lg bg-[#F5C518] px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-black inline-block">
                        {formatSpeed(reg.arrivalLog.speed)}
                      </span>
                    ) : (
                      <span className="font-mono text-gray-500">PENDING</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {isArrival ? (
                      <span className="nb-badge bg-green-500 text-black text-[10px]">QUALIFIED</span>
                    ) : (
                      <span className="nb-badge bg-gray-200 dark:bg-black/40 text-gray-500 text-[10px]">ON_FLIGHT</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
