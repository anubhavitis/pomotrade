"use client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineX } from "react-icons/ai";
import { UserIcon } from "@/components/ui/user";
import { SettingForm } from "@/components/wallet/setting-modal-form";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";

const Header = () => {
    return (
        <div>
            <Link href="/" className="flex items-center gap-1 justify-center">
                <Image src="/logo.png" alt="PomoTrade" width={48} height={48} />
                <h1 className="text-sm md:text-2xl leading-none font-bold ">
                    PomoTrade
                </h1>
            </Link>
        </div>
    );
};

const NavbarWrapper = ({ children }: { children: React.ReactNode }) => (
    <nav className="p-8 absolute inset-0 w-screen h-fit flex justify-between items-center">
        <Header />
        {children}
    </nav>
);

const Navbar = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    return user ? <AuthNavbar /> : <PublicNavbar />
};

export default Navbar;


const PublicNavbar = () => (
    <NavbarWrapper>
        <div>
            <Link href="https://x.com/pomotrade" target="_blank">
                <AiOutlineX size={20} />
            </Link>
        </div>
    </NavbarWrapper>
);

const AuthNavbar = () => (
    <NavbarWrapper>
        <div className="flex items-center gap-4">
            <SettingForm />
            <UserIcon className="hover:bg-transparent" />
        </div>
    </NavbarWrapper>
);
