"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import TradingViewWidget from "@/components/trading/tradingview";
import TradeWidget from "@/components/trade-widget";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function getAuthUser() {
      const user = await getUser();

      if (!user) {
        router.push("/auth");
      }
    }
    getAuthUser();
  }, [router]);


  return (
    <div className="flex flex-row gap-2 overflow-hidden p-2 w-full h-full">
      <div className="h-full grow self-stretch">
        <TradingViewWidget />
      </div>
      <div className="h-full overflow-hidden w-[250px] flex border-2 border-emerald-600">
        <h1 className="text-2xl text-white">
          OrderBook here
        </h1>
      </div>
      <div className="h-full overflow-hidden w-[260px] flex">
        <TradeWidget />
      </div>
    </div>
  );
}
