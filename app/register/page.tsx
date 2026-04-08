"use client";

import { useActionState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Plane, Loader2 } from "lucide-react";
import { registerUserAction } from "@/app/actions/auth-actions";
import { toast } from "sonner";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUserAction, null);

  useEffect(() => {
    if (state?.error) {
      toast.error("REGISTRATION_FAILURE", {
        description: state.error,
      });
    }
  }, [state]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="nb-card w-full max-w-md p-8 bg-white">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center border-[4px] border-black bg-primary shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
              <Plane className="h-12 w-12 rotate-[-45deg] stroke-[3px]" />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-black leading-none italic">
              Register <br /> Account
            </h1>
            <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-[0.2em]">Join the Kalapato Fleet</p>
          </div>
          
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label className="nb-badge bg-black text-primary mb-1 inline-block">
                Full_Name
              </Label>
              <Input 
                name="name" 
                type="text" 
                placeholder="Pilot Name" 
                className="nb-input h-14" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="nb-badge bg-black text-primary mb-1 inline-block">
                Pilot_Email
              </Label>
              <Input 
                name="email" 
                type="email" 
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
                name="password" 
                type="password" 
                placeholder="••••••••" 
                className="nb-input h-14" 
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isPending}
              className="nb-button w-full bg-primary text-black h-20 text-xl disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 h-8 w-8 animate-spin stroke-[3px]" />
                  COMMUNICATING...
                </>
              ) : (
                "INITIALIZE_PERSONNEL"
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                Already registered?{" "}
                <Link href="/login" className="text-black font-black underline decoration-[3px] underline-offset-4 hover:text-primary transition-colors">
                  Initialize Session
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
