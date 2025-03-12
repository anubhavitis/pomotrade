import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
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
          className="absolute inset-0"
          squareSize={4}
          gridGap={6}
          color1="#ffffff"
          color2="#ffffff"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <Navbar />
        <main className="flex-grow overflow-y-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
