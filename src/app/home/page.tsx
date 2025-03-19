"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import TradingViewWidget from "@/components/trading/tradingview";
import WebSocketDataDisplay from "@/components/websocket-data";
import TradeWidget from "@/components/trade-widget";

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

      if (!user) {
        router.push("/auth");
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
    getAuthUser();
  }, [router]);


  return (
    <div className="h-[calc(100vh-64px)] grid grid-cols-12 gap-2 overflow-hidden p-2">
      <div className="flex flex-col col-span-2 items-center justify-center gap-4 sm:hidden lg:block">
        <h1 className="text-2xl text-white">
          Logged in!
        </h1>
        {name && (
          <p className="text-lg text-white ">
            {name}
          </p>
        )}
        {email && (
          <p className="text-lg text-white">
            {email}
          </p>
        )}
      </div>
      <div className="col-span-8 col-start-3 lg:col-span-8 lg:col-start-3 sm:col-start-2 h-full">
        <TradingViewWidget />
      </div>
      <div className="col-span-2 lg:col-span-2 h-full overflow-hidden">
        <TradeWidget />
      </div>
    </div>
  );
}
