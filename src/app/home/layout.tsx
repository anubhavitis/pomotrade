import type { Metadata } from "next";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import AuthNavbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "PomoTrade - Dashboard",
    description: "Jump start your trading career with funded accounts",
};

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen w-full relative">
            <FlickeringGrid
                className="absolute inset-0 -z-[1] opacity-100"
                squareSize={4}
                gridGap={6}
                color1="#ffffff"
                color2="#ffffff"
                maxOpacity={0.3}
                flickerChance={0.2}
            />
            <AuthNavbar />
            <main className="flex-grow overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
