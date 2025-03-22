import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PomoTrade",
  description: "Jump start your trading career with funded accounts",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased bg-transparent w-screen h-screen flex flex-col text-white relative`}
      >
        <FlickeringGrid
          className="absolute inset-0 pointer-events-none"
          squareSize={4}
          gridGap={6}
          color1="#ffffff"
          color2="#ffffff"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <div className="h-full w-full flex flex-col gap-2">
          <Navbar />
          <main className="grow h-full w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
