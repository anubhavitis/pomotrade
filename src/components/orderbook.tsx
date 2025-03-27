"use client";

import { useMemo } from "react";
import { useOrderbook, OrderBookLevel } from "@/hooks/order-book";

interface EnhancedOrderBookLevel extends OrderBookLevel {
    total: number;
}

export default function OrderBook() {
    const { orderbookData } = useOrderbook();

    const sortBids = useMemo(() => (bids: OrderBookLevel[] | undefined, n: number = 15): EnhancedOrderBookLevel[] => {
        const sorted = (bids?.slice().sort((a: OrderBookLevel, b: OrderBookLevel) =>
            parseFloat(b.px) - parseFloat(a.px)) || []).slice(0, n);

        let total = 0;
        return sorted.map(bid => {
            total += parseFloat(bid.sz);
            return {
                ...bid,
                total
            };
        });
    }, []);

    const sortAsks = useMemo(() => (asks: OrderBookLevel[] | undefined, n: number = 15): EnhancedOrderBookLevel[] => {
        const sorted = (asks?.slice().sort((a: OrderBookLevel, b: OrderBookLevel) =>
            parseFloat(a.px) - parseFloat(b.px)) || []).slice(0, n);

        let total = 0;
        return sorted.map(ask => {
            total += parseFloat(ask.sz);
            return {
                ...ask,
                total
            };
        });
    }, []);

    const bids = useMemo(() => sortBids(orderbookData?.data?.levels?.[0]), [orderbookData?.data?.levels, sortBids]);
    const asks = useMemo(() => sortAsks(orderbookData?.data?.levels?.[1]), [orderbookData?.data?.levels, sortAsks]);

    return <div className="flex flex-col h-full w-full rounded-lg border border-white/10 ">
        <div className="px-2 pt-1 flex flex-row gap-2 justify-between rounded-md border-b border-white/10 bg-black/5 backdrop-blur-sm">
            <div> price</div>
            <div> size</div>
            <div> total</div>
        </div>
        <div className="w-full h-full overflow-y-auto border-b border-white/10">
            {bids.map((bid: EnhancedOrderBookLevel, index: number) => (
                <div key={`bid-${index}`} className="flex flex-row justify-between px-2 bg-red-500 ">
                    <div>{bid.px}</div>
                    <div>{bid.sz}</div>
                    <div>{bid.total.toFixed(8)}</div>
                </div>
            ))}
        </div>
        <div className="w-full h-full overflow-y-auto">
            {asks.map((ask: EnhancedOrderBookLevel, index: number) => (
                <div key={`ask-${index}`} className="flex flex-row justify-between px-2 bg-green-500">
                    <div>{ask.px}</div>
                    <div>{ask.sz}</div>
                    <div>{ask.total.toFixed(8)}</div>
                </div>
            ))}
        </div>
    </div>;
}
