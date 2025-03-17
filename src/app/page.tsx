"use client";
import Waitlist from "@/components/landing/waitlist";
import Landing from "@/components/landing/landing";
import { useEffect } from "react";
import { getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log("user", user);
      if (user) {
        router.push("/home");
      }
    };
    fetchUser();
  }, [router]);

  return (
    <div>
      <div className="absolute z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
        <Landing />
        <Waitlist />
      </div>
    </div>
  );
}
