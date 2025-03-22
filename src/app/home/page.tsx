"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import TradingViewWidget from "@/components/trading/tradingview";
import TradeWidget from "@/components/trade-widget";
import OrderBook from "@/components/orderbook";

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
    <div className="flex flex-row gap-1 p-2 w-full h-full my-2">
      <div className="h-full w-full grow self-stretch">
        <TradingViewWidget />
      </div>
      <div className="h-full w-[250px] shrink-0 flex">
        <OrderBook />
      </div>
      <div className="h-full w-[260px] shrink-0 flex">
        <TradeWidget />
      </div>
    </div>
  );
}
