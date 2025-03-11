"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";

export default function HomePage() {
    const router = useRouter();
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);


    useEffect(() => {
        async function getAuthUser() {
            const user = await getUser();
            console.log("user", user);

            if (!user) {
                router.push("/login");
            }

            setName(user.data.name);
            setEmail(user.data.email);
        }
        getAuthUser();
    }, [router]);


    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl text-white">
                Logged in!
            </h1>
            {name && (
                <p className="text-lg text-white">
                    {name}
                </p>
            )}
            {email && (
                <p className="text-lg text-white">
                    {email}
                </p>
            )}
        </div>
    );
}
