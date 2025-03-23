// store.js
import { create } from 'zustand';

export interface AssetStore {
    asset: Assets;
    setAsset: (newAsset: Assets) => void;
}

export enum Assets {
    BTC = "BTC",
    HYPE = "HYPE"
}

const useAssetStore = create<AssetStore>((set) => ({
    asset: Assets.BTC,
    setAsset: (newAsset: Assets) => set({ asset: newAsset }),
}));

export default useAssetStore;