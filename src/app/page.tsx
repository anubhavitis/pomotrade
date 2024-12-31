"use client";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Waitlist from "@/components/waitlist";
import Landing from "@/components/landing";

export default function Home() {
  useEffect(() => {}, []);

  return (
    <div className="w-full h-screen p-4 bg-sky-950 text-white">
      <Navbar />
      <Landing />
      <Waitlist />
    </div>
  );
}
