"use client";
import Waitlist from "@/components/waitlist";
import Landing from "@/components/landing";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
        <Navbar />
        <Landing />
        <Waitlist />
      </div>
    </div>
  );
}
