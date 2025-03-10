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

  const handleActiveTab = () => {
    setActiveTab(activeTab === "buy" ? "sell" : "buy");
  };

  return (
    // <div className="max-w-md mx-auto bg-slate-50 min-h-screen">
    <div className="max-w-md mx-auto min-h-screen p-1">
      <h1 className="text-5xl font-bold mb-16">{activeTab}</h1>

      <div className="rounded-md overflow-hidden">
        <div className="grid grid-cols-2">
          <Button
            // className={`py-4 text-center text-white font-medium cursor-pointer ${
            //   activeTab === "buy" ? "bg-emerald-500" : "bg-slate-800"
            // }`}
            onClick={handleActiveTab}
          >
            Buy
          </Button>
          <Button
            // className={`py-4 text-center text-white font-medium cursor-pointer ${
            //   activeTab === "sell" ? "bg-rose-700" : "bg-slate-800"
            // }`}
            onClick={handleActiveTab}
          >
            Sell
          </Button>
        </div>

        <div className="bg-slate-800 text-white p-6 rounded-b-md">
          <div className="mb-6">
            <p className="text-lg">
              Order Type: <span className="font-medium">Limit</span>
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">At Price</p>
            <div className="relative">
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white text-xl py-6 px-4 rounded-md w-full"
              />
              <button
                className={`absolute right-3 top-1/2 -translate-y-1/2 font-medium ${
                  activeTab === "buy" ? "text-emerald-500" : "text-rose-700"
                } `}
              >
                Get Lowest Price
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <p className="text-lg">Quantity</p>
              <p className="text-slate-400">Min 0.00004 BTC</p>
            </div>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xl py-6 px-4 rounded-md w-full"
            />
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">Total INR Value</p>
            <div className="bg-slate-900 border border-slate-700 text-white text-xl py-6 px-4 rounded-md w-full">
              <span className="font-medium">{totalValue}</span>
              <span className="text-slate-400 ml-2">≈ {approximateValue}</span>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button className="text-slate-400">View fee breakup</button>
          </div>

          <div className="mb-8">
            <p className="text-lg">
              Available balance : <span className="font-medium">₹1,00,500</span>
            </p>
          </div>

          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-6 text-lg">
            PLACE ORDER
          </Button>
        </div>
      </div>
    </div>
    // </div>
  );
}
