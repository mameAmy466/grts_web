import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { PersistentRadioBar } from "@/components/players";
import { RadioPlayerProvider } from "@/components/radio-player-provider";
import { getLiveRadioStation } from "@/lib/api/tve";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GRTS — Gambia Radio & Television Service",
    template: "%s | GRTS",
  },
  description:
    "Informing. Educating. Entertaining. The national broadcaster of The Gambia.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const station = await getLiveRadioStation();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <RadioPlayerProvider station={station}>
          {children}
          <Suspense>
            <PersistentRadioBar />
          </Suspense>
        </RadioPlayerProvider>
      </body>
    </html>
  );
}
