import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PomoTrade",
  description: "Jump start your trading career with funded accounts",
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
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
