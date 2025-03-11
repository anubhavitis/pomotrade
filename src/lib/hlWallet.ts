
type WalletData = {
    address: string;
    api_key: string;
    api_secret: string;
}

export function getHLWallet(): WalletData {
    const data = JSON.parse(localStorage.getItem('pomotrade-hl-wallet') || "{}")
    if (data) {
        return data
    } else {
        return {
            address: "",
            api_key: "",
            api_secret: ""
        }
    }
}

export function saveHLWallet(wallet: WalletData) {
    localStorage.setItem('pomotrade-hl-wallet', JSON.stringify(wallet))
}