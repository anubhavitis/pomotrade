import Image from "next/image";
import Link from "next/link";
import { AiOutlineX } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="p-8 absolute z-20 inset-0 w-screen h-fit flex justify-between items-center">
      <div>
        <Link href="/" className="flex items-center gap-4 justify-center">
          <Image src="/PomoTrade.svg" alt="PomoTrade" width={48} height={48} />
          <h1 className="text-sm md:text-2xl leading-none font-bold ">
            PomoTrade
          </h1>
        </Link>
      </div>
      <div>
        <Link href="https://x.com/pomotrade" target="_blank">
          <AiOutlineX size={20} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
