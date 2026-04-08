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
  title: "Antigravity | Pigeon Racing Tracker",
  description: "A precision instrument for flight operations and racing scoreboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", spaceMono.variable, barlowCondensed.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-[#0A0F1E] text-white selection:bg-[#F5C518] selection:text-[#0A0F1E]">
        {children}
      </body>
    </html>
  );
}
