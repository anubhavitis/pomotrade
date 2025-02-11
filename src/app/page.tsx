"use client";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Waitlist from "@/components/waitlist";
import Landing from "@/components/landing";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = document.getElementById("cursor-light");
      if (cursor) {
        cursor.style.left = `${e.clientX - 50}px`;
        cursor.style.top = `${e.clientY - 50}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-transparent w-screen h-screen overflow-y-hidden p-4 text-white relative">
      <FlickeringGrid
        className="absolute inset-0"
        squareSize={5}
        gridGap={5}
        color1="#00de5c"
        color2="#f34723"
        maxOpacity={0.1}
        flickerChance={0.1}
      />
      <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
        <Navbar />
        <Landing />
        <Waitlist />
      </div>
    </div>
  );
}
