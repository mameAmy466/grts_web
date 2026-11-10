import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { PersistentRadioBar } from "@/components/players";
import { RadioPlayerProvider } from "@/components/radio-player-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getLiveRadioStation } from "@/lib/api/tve";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

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
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved/system theme before first paint (no flash). */}
        <script
          // text/plain on the client avoids React's dev warning about rendering <script>.
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-page text-fg">
        <ThemeProvider>
          <RadioPlayerProvider station={station}>
            <LocaleProvider>
              {children}
              <Suspense>
                <PersistentRadioBar />
              </Suspense>
            </LocaleProvider>
          </RadioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
