"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { SettingsGearIcon } from "../ui/settings-gear"
import { getAuthTokens } from "@/lib/tokens"
import { HomeIcon } from "../ui/home"

type WalletData = {
    address: string;
    api_key: string;
    api_secret: string;
    encrypted: boolean;
    client: string;
}

export function SettingForm() {
    const title = "Add Hyperliquid Configs"
    const description = "We don't store your wallet configs on our servers. They are stored locally on your device."
    const [saveButton, setSaveButton] = useState("Save locally")
    const { toast } = useToast()

    const [address, setAddress] = useState<string>("")
    const [api_key, setApiKey] = useState<string>("")
    const [api_secret, setApiSecret] = useState<string>("")


    async function getWallet() {
        const data = JSON.parse(localStorage.getItem('pomotrade-hl-wallet') || "{}")

        setAddress(data.address)
        setApiKey(data.api_key)
        setApiSecret(data.api_secret)
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaveButton("Saving...")

        try {

            const data = {
                address: address,
                api_key: api_key,
                api_secret: api_secret
            }

            // Save wallet data to localStorage
            localStorage.setItem('pomotrade-hl-wallet', JSON.stringify(data));

            toast({
                title: "Success",
                description: "Wallet configuration saved successfully.",
            })

            // Simulate API call

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            })
        } finally {
            setSaveButton("Saved")
        }
    }

    useEffect(() => {
        setSaveButton("Save locally")
    }, [address, api_key, api_secret])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button onClick={getWallet}>
                    <SettingsGearIcon className="hover:bg-transparent z-10 pointer-events-auto block" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        <div>
                            <div>
                                {description}
                            </div>
                            <div>
                                <a
                                    className="text-blue-400 hover:text-blue-600 underline"
                                    href="https://docs.hyperliquid.xyz/hyperliquid-api/getting-started/quickstart"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    how to get hyperliquid configs </a>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium text-white">
                            Address
                        </label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="0x............"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="api_key" className="text-sm font-medium text-white">
                            API Key
                        </label>
                        <Input
                            id="api_key"
                            name="api_key"
                            placeholder="0x............"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                            className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="api_secret" className="text-sm font-medium text-white">
                            API Secret
                        </label>
                        <Input
                            id="api_secret"
                            name="api_secret"
                            placeholder="0x............"
                            value={api_secret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            required
                            className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            className={`w-full px-4 rounded-md border-x border-white/5 bg-transparent hover:bg-green-700 text-white hover:text-black transition-colors backdrop-blur-sm h-10 ${saveButton ? "animate-pulse" : "hover:shadow-lg"}`}
                        >
                            <HomeIcon className=" hover:text-black hover:bg-transparent" />
                            {saveButton}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 