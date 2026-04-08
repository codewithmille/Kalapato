import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Activity, 
  Zap, 
  Navigation, 
  ChevronRight,
  TrendingUp,
  Award,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F0F0F0] dark:bg-[#0A0F1E]">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-40 border-b-[6px] border-black">
          {/* Background Grid */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-10" 
               style={{ backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mb-8 inline-flex items-center gap-3 nb-badge bg-[#F5C518] text-black px-6 py-2 text-sm">
              <Activity className="h-5 w-5 stroke-[3px]" />
              <span>LIVE_OPERATIONS_ACTIVE</span>
            </div>
            
            <h1 className="mb-8 text-7xl font-black uppercase tracking-tighter leading-[0.8] text-black dark:text-white md:text-[10rem]">
              FLIGHT <br />
              <span className="text-[#F5C518] shadow-black drop-shadow-[8px_8px_0px_rgba(0,0,0,1)]">INTEL</span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-2xl text-xl font-black uppercase tracking-tight text-gray-500 dark:text-gray-400">
              High-precision flight operations for professional pigeon racing. 
              Real-time telemetry, Haversine distance mapping, and elite leaderboards.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link href="/dashboard">
                <Button className="nb-button h-20 px-12 bg-[#F5C518] text-black text-2xl">
                  GO TO DASHBOARD
                  <ChevronRight className="ml-2 h-8 w-8 stroke-[4px]" />
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="nb-button h-20 px-12 bg-white dark:bg-black text-black dark:text-white text-2xl">
                  VIEW MISSIONS
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section / Telemetry */}
        <section className="border-b-[6px] border-black bg-white dark:bg-[#0D1426] py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
              {[
                { label: "AVG VELOCITY", value: "1,142 m/min", icon: TrendingUp },
                { label: "ACTIVE UNITS", value: "482", icon: Plane },
                { label: "PRECISION", value: "0.0001", icon: Zap },
                { label: "GLOBAL HUBS", value: "24", icon: Globe },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center group">
                  <div className="mb-4 flex items-center gap-2 nb-badge bg-black text-[#F5C518] px-3 py-1">
                    <stat.icon className="h-4 w-4 stroke-[3px]" />
                    {stat.label}
                  </div>
                  <div className="font-mono text-4xl font-black text-black dark:text-white uppercase transition-transform group-hover:scale-110">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Blocks */}
        <section className="py-24 bg-[#F0F0F0] dark:bg-[#0A0F1E]">
          <div className="container mx-auto px-4">
            <div className="mb-20">
              <h2 className="text-6xl font-black uppercase tracking-tighter text-black dark:text-white leading-tight">
                Racing <br /> Infrastructure
              </h2>
              <p className="mt-6 text-xl font-bold uppercase text-gray-500 max-w-xl">Military-grade tools for elite elite pigeon racing operations.</p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  title: "Telemetry Dashboard",
                  desc: "Live rankings and per-bird performance analytics with high-contrast ranking tiles.",
                  icon: Activity,
                  color: "bg-[#F5C518]"
                },
                {
                  title: "Precision Navigation",
                  desc: "Exact Haversine formula calculation for release-to-loft distance mapping.",
                  icon: Navigation,
                  color: "bg-cyan-400"
                },
                {
                  title: "Elite Standing",
                  desc: "Automated result verification and podium qualification for club championships.",
                  icon: Award,
                  color: "bg-pink-500"
                }
              ].map((feature, i) => (
                <div key={i} className="nb-card p-10 group bg-white dark:bg-[#1E2A3A] hover:bg-[#F5C518] dark:hover:bg-[#F5C518] hover:text-black transition-colors">
                  <div className={`mb-8 inline-flex h-16 w-16 items-center justify-center border-[3px] border-black ${feature.color} text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all`}>
                    <feature.icon className="h-8 w-8 stroke-[3px]" />
                  </div>
                  <h3 className="mb-4 text-3xl font-black uppercase leading-none">{feature.title}</h3>
                  <p className="font-bold text-gray-500 dark:text-gray-400 group-hover:text-black mt-4 uppercase text-sm leading-tight">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-32 pt-12">
          <div className="container mx-auto px-4">
            <div className="nb-card bg-[#F5C518] p-12 md:p-24 text-center">
              <h2 className="mb-8 text-6xl font-black uppercase tracking-tighter text-black md:text-8xl leading-[0.8]">
                READY FOR <br /> TAKEOFF?
              </h2>
              <p className="mx-auto mb-12 max-w-xl text-xl font-black uppercase text-black/70 italic">
                Join the elite community of pigeon fanciers using Kalapato for club operations.
              </p>
              <Link href="/register">
                <Button className="nb-button h-24 px-16 bg-black text-[#F5C518] text-3xl font-black">
                  INITIALIZE ACCOUNT
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-[6px] border-black bg-white dark:bg-[#0D1426] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 border-[2px] border-black bg-[#F5C518] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <Plane className="h-6 w-6 text-black rotate-[-45deg]" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter text-black dark:text-white">Kalapato</span>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">
            © 2026 KALAPATO FLIGHT OPERATIONS // ALL SYSTEMS NOMINAL
          </p>
        </div>
      </footer>
    </div>
  );
}
