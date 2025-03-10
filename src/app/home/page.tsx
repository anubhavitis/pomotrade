"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        async function checkAuthStatus() {
            const isAuthenticated = await checkAuth();

            if (!isAuthenticated) {
                router.push("/login");
            }
        }

        checkAuthStatus();
    }, [router]);


    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl text-white">
                Logged in!
            </h1>
        </div>
    );
}
