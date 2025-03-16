"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TradeWidget() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("₹1,201");
  const [quantity, setQuantity] = useState("0.00057 BTC");
  const [totalValue, setTotalValue] = useState("₹10,00,005");
  const [approximateValue, setApproximateValue] = useState("₹98,00,000.03");

  const priceActionText = activeTab === "buy" ? "Buy" : "Sell";



  return (
    <div className="max-w-full md:max-w-sm mx-auto min-h-svh p-0 md:p-1 mt-20 text-sm">
      <div className="overflow-hidden">
        <div className="grid grid-cols-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("buy")}
            className={`py-4 md:py-7 text-center rounded-none font-medium cursor-pointer ${activeTab === "buy"
              ? "bg-white/10 backdrop-blur-lg hover:bg-white/20 text-emerald-500 font-bold"
              : "bg-black/5 backdrop-blur-sm"
              } hover:text-emerald-500 hover:font-bold `}
          >
            Buy
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("sell")}
            className={`py-4 md:py-7 text-center text-white font-medium cursor-pointer rounded-none ${activeTab === "sell"
              ? "bg-white/10 backdrop-blur-lg hover:bg-white/20 text-rose-500 font-bold"
              : "bg-black/5 backdrop-blur-md"
              } hover:text-rose-500 hover:font-bold`}
          >
            Sell
          </Button>
        </div>

        <div className="bg-black/5 backdrop-blur-md text-white md:p-3">
          <div className="md:mb-4">
            <p className="text-base">
              Order Type: <span className="font-medium">Limit</span>
            </p>
          </div>

          <div className="mb-4">
            <p className="text-base mb-2">At Price</p>
            <div className="relative">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white/10 border-slate-700 text-white text-base py-4 px-3 rounded-md w-full"
              />
              <button
                className={`absolute right-3 top-1/2 -translate-y-1/2 font-medium  ${activeTab === "buy"
                  ? "text-emerald-500 hover:text-emerald-600"
                  : "text-rose-700 hover:text-rose-800"
                  } `}
              >
                Get Lowest Price
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <p className="text-base">Quantity</p>
              <p className="text-slate-400">Min 0.00004 BTC</p>
            </div>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-white/10 border-slate-700 text-white text-base py-4 px-3 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <p className="text-base mb-2">Total INR Value</p>
            <div className="bg-white/10 border border-slate-700 text-white text-base py-4 px-3 rounded-md w-full">
              <span className="font-medium">{totalValue}</span>
              <span className="text-slate-400 ml-2">≈ {approximateValue}</span>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button className="text-slate-400">View fee breakup</button>
          </div>

          <div className="mb-6">
            <p className="text-base">
              Available balance : <span className="font-medium">₹1,00,500</span>
            </p>
          </div>

          <Button
            className={`w-full rounded-none ${activeTab === "buy"
              ? "bg-emerald-700 hover:bg-emerald-800"
              : "bg-rose-700 hover:bg-rose-800"
              }  text-white font-medium py-6 text-lg`}
          >
            PLACE ORDER
          </Button>
        </div>
      </div>
    </div>
  );
}
