import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@/components/ui/user";
import { SettingForm } from "./wallet/setting-modal-form";

const AuthNavbar = () => {
    return (
        <nav className="p-8 absolute z-10 inset-0 w-screen h-fit flex justify-between items-center">
            <div>
                <Link href="/" className="hover:scale-105 transition-transform duration-300 flex items-center gap-4 justify-center">
                    <Image src="/PomoTrade.svg" alt="PomoTrade" width={48} height={48} />
                    <h1 className="text-sm md:text-2xl leading-none font-bold transition-transform duration-300">
                        PomoTrade
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <SettingForm />
                <UserIcon className="hover:bg-transparent" />
            </div>
        </nav>
    );
};

export default AuthNavbar;
