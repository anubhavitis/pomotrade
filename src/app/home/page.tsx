"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import TradingViewWidget from "@/components/trading/tradingview";
import TradeWidget from "@/components/trade-widget";
import OrderBook from "@/components/orderbook";
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

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
    <div className="flex flex-col gap-1 w-full h-full my-2">
      <div className="flex flex-row gap-1 border border-white/10 bg-black w-full h-16 rounded-lg">
        <div className="my-auto">
          <Select defaultValue="light">
            <SelectTrigger className="mx-2 px-4 border-white">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="bg-white/5 backdrop-blur-sm border-white/5 text-white">
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full h-[600px] flex flex-row gap-1 ">
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
      <div className="w-full h-[300px] flex flex-row gap-1">
        <div className="p-2 h-full w-full grow self-stretch border border-white/10 bg-black rounded-lg">
          Hello
        </div>
        <div className="p-2 h-full w-full grow self-stretch border border-white/10 bg-black rounded-lg">
          World
        </div>
      </div>
    </div>
  );
}
