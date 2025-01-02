import Image from "next/image";
import Link from "next/link";
import { AiOutlineX } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="p-8 absolute z-10 inset-0 w-screen h-fit backdrop-blur-sm flex justify-between items-center ">
      <div>
        <Link href="/" className="flex items-center gap-4 justify-center">
          <Image src="/EzDawg.svg" alt="EzDawg" width={24} height={24} />
          <h1 className="text-sm md:text-2xl leading-none font-bold ">EzDawg</h1>
        </Link>
      </div>
      <div>
        <Link href="https://x.com/ezdawg_inc" target="_blank">
          <AiOutlineX size={20} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
