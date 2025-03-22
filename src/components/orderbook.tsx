"use client";

import { getOrderbook, OrderBookLevel } from "@/hooks/order-book";
import { useMemo } from "react";

interface EnhancedOrderBookLevel extends OrderBookLevel {
    total: number;
}

export default function OrderBook() {
    const { orderbookData, isConnected, error } = getOrderbook();

    const formatNumber = (num: number): string => {
        return num.toFixed(num >= 1 ? 5 : 5);
    };

    const processLevels = (levels: OrderBookLevel[] | undefined, n: number = 12): EnhancedOrderBookLevel[] => {
        if (!levels) return [];
        let total = 0;
        return levels.map(level => {
            const size = parseFloat(level.sz);
            total += size;
            return {
                ...level,
                total
            };
        });
    };

    const sortBids = (bids: OrderBookLevel[] | undefined, n: number = 14): EnhancedOrderBookLevel[] => {
        const sorted = (bids?.slice().sort((a, b) => parseFloat(b.px) - parseFloat(a.px)) || []).slice(0, n);
        return processLevels(sorted);
    };

    const sortAsks = (asks: OrderBookLevel[] | undefined, n: number = 14): EnhancedOrderBookLevel[] => {
        const sorted = (asks?.slice().sort((a, b) => parseFloat(a.px) - parseFloat(b.px)) || []).slice(0, n);
        return processLevels(sorted);
    };

    const bids = useMemo(() => sortBids(orderbookData?.data?.levels?.[0]), [orderbookData?.data?.levels]);
    const asks = useMemo(() => sortAsks(orderbookData?.data?.levels?.[1]), [orderbookData?.data?.levels]);

    return (
        <div className="flex flex-col h-full w-full rounded-lg bg-black text-sm">
            <div className="px-4 py-2 flex flex-row justify-between text-gray-400 border-b border-gray-800">
                <div>Price</div>
                <div>Size</div>
                <div>Total</div>
            </div>

            <div className="w-full overflow-y-auto">
                {asks.reverse().map((ask, index) => (
                    <div
                        key={`ask-${index}`}
                        className="flex flex-row justify-between px-4 py-0.5 hover:bg-white/5"
                    >
                        <div className="text-[#ff4976]">{parseFloat(ask.px).toLocaleString()}</div>
                        <div className="text-gray-300">{formatNumber(parseFloat(ask.sz))}</div>
                        <div className="text-gray-300">{formatNumber(ask.total)}</div>
                    </div>
                ))}
            </div>

            <div className="px-4 py-1 flex justify-between border-y border-gray-800">
                <div>Spread</div>
                <div>{Math.abs(parseFloat(asks[asks.length - 1]?.px) - parseFloat(bids[0]?.px)).toFixed(1)}</div>
                <div>{((Math.abs(parseFloat(asks[asks.length - 1]?.px) - parseFloat(bids[0]?.px)) / parseFloat(asks[asks.length - 1]?.px) * 100)).toFixed(3)}%</div>
            </div>

            <div className="w-full overflow-y-auto">
                {bids.map((bid, index) => (
                    <div
                        key={`bid-${index}`}
                        className="flex flex-row justify-between px-4 py-0.5 hover:bg-white/5"
                    >
                        <div className="text-[#00c087]">{parseFloat(bid.px).toLocaleString()}</div>
                        <div className="text-gray-300">{formatNumber(parseFloat(bid.sz))}</div>
                        <div className="text-gray-300">{formatNumber(bid.total)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
