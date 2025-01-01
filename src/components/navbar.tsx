import Link from "next/link";
import { AiOutlineX } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="mx-auto py-2 w-full lg:w-4/5 flex justify-between items-center ">
      <div>
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="EzDawg" className="w-20 h-20" />
          <h1 className="text-sm md:text-xl font-bold ">EzDawg</h1>
        </Link>
      </div>
      <div>
        <Link href="https://x.com/ezdawg_inc" target="_blank">
          <AiOutlineX size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
