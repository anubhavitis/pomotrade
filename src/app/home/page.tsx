"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import TradingViewWidget from "@/components/trading/tradingview";
export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getAuthUser() {
      const user = await getUser();
      console.log("user", user);

      if (!user) {
        router.push("/auth");
      }

      setName(user.data.name);
      setEmail(user.data.email);
    }
    getAuthUser();
  }, [router]);

  return (
    <div className="grid grid-cols-6 gap-4 my-28 border border-black ">
      <div className="flex flex-col items-center justify-center gap-4 sm:hidden md:hidden lg:block ">
        <h1 className="text-2xl text-white">Logged in!</h1>
        {name && <p className="text-lg text-white">{name}</p>}
        {email && <p className="text-lg text-white">{email}</p>}
      </div>
      <div className="col-span-5 col-start-1 min-h-screen lg:col-span-4 lg:col-start-2  sm:col-start-1">
        <TradingViewWidget />
      </div>
      <div className="">Trade Widget</div>
    </div>
  );
}
