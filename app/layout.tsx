import type { Metadata } from "next";
import { Space_Mono, Barlow_Condensed, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kalapato | Pigeon Racing Tracker",
  description: "A precision instrument for flight operations and racing scoreboard.",
};

import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/components/Providers";
import { PWARegistration } from "@/components/PWARegistration";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", spaceMono.variable, barlowCondensed.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-black">
        <Providers>
          <PWARegistration />
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}


