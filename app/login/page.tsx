"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Plane, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get("registered");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
    
    if (registered === "true") {
      toast.success("PERSONNEL_INITIALIZED", {
        description: "Credentials verified. You may now initialize session.",
      });
      // Clean up the URL
      router.replace("/login");
    }
  }, [status, router, registered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("AUTHENTICATION_FAILED: INVALID_CREDENTIALS");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("SYSTEM_ERROR: UNABLE_TO_REACH_AUTH_SERVER");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="nb-card w-full max-w-md p-8 bg-white">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-[4px] border-black bg-primary shadow-[6px_6px_0_0_rgba(0,0,0,1)] overflow-hidden p-2">
              <img src="/pigeon-logo.png" alt="Kalapato" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none italic">
              Initialize <br /> Session
            </h1>
            <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-[0.2em]">Personnel Authentication Required</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="nb-card bg-destructive text-white p-4 flex items-center gap-3 shadow-none border-[3px] border-black">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span className="text-[10px] font-black uppercase leading-tight tracking-widest">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label className="nb-badge bg-black text-primary mb-1 inline-block">
                Pilot_Email
              </Label>
              <Input 
                type="email" 
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pilot@kalapato.ph" 
                className="nb-input h-14" 
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="nb-badge bg-black text-primary mb-1 inline-block">
                Security_Key
              </Label>
              <Input 
                type="password" 
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="nb-input h-14" 
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="nb-button w-full bg-primary text-black h-20 text-xl disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-8 w-8 animate-spin stroke-[3px]" />
                  SYNCING...
                </>
              ) : (
                "AUTHENTICATE_PERSONNEL"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                New flight personnel?{" "}
                <Link href="/register" className="text-black font-black underline decoration-[3px] underline-offset-4 hover:text-primary transition-colors">
                  Register Unit
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary stroke-[3px]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
