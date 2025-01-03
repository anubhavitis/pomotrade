"use client";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Waitlist from "@/components/waitlist";
import Landing from "@/components/landing";
import { BackgroundBeams } from "@/components/ui/background-beams";

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
      <div
        id="cursor-light"
        className="pointer-events-none fixed w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl"
      />
      <Navbar />
      <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
        <Landing />
        <Waitlist />
      </div>
      <BackgroundBeams />
    </div>
  );
}
