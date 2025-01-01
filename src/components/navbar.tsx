import Link from "next/link";
import { AiOutlineX } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="mx-auto flex justify-between items-center py-4 w-full lg:w-4/5">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.png" alt="EzDawg" className="w-20 h-20" />
        <h1 className="text-xl font-bold ">EzDawg</h1>
      </Link>

      <Link href="https://x.com/ezdawg_inc" target="_blank">
        <AiOutlineX size={24} />
      </Link>
    </nav>
  );
};

export default Navbar;
