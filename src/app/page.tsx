"use client";
import Waitlist from "@/components/landing/waitlist";
import Landing from "@/components/landing/landing";
export default function Home() {
  return (
    <div>
      <div className="absolute z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
        <Landing />
        <Waitlist />
      </div>
    </div>
  );
}
