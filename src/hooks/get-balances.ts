import { getHLWallet } from "@/lib/hlWallet";


export interface Balance {
    coin: string;
    token: number;
    total: string;
    hold: string;
    entryNtl: string;
}

interface ApiBalanceResponse {
    balances: Array<Balance>;
}



export async function getBalances(): Promise<Map<string, Balance> | null> {
    try {
        const wallet = getHLWallet();
        if (!wallet || !wallet.address) {
            console.error("No wallet address found");
            return null;
        }

        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "spotClearinghouseState",
                user: wallet.address
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as ApiBalanceResponse;
        const balancesMap = new Map<string, Balance>();
        data.balances.forEach(balance => {
            balancesMap.set(balance.coin, balance);
        });
        return balancesMap;
    } catch (error) {
        console.error('Error fetching balances:', error);
        return null;
    }
}

// Helper function to format balance
export function formatBalance(balance: string): string {
    return Number(balance).toFixed(8);
}

// Helper function to get specific asset balance
export function getAssetBalance(balances: Map<string, Balance> | null, asset: string): string {
    if (!balances) {
        return "0";
    }
    return formatBalance(balances.get(asset)?.total || "0");
}
