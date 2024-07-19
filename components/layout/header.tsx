import RoutePath from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

import RenderNavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

const Header = () => {
  return (
    <header className="top-0 z-20 flex w-full items-center bg-gray10 px-8 py-3 text-xs">
      <Link href={"/profile"}>
        <Image
          src="/assets/images/navbar/logo.svg"
          width={40}
          height={40}
          alt="unitap"
        />
      </Link>

      <UserAuthStatus />

      <div className="hidden flex-1 md:flex"></div>

      <div className="hidden md:flex">
        <RenderNavbarDropdown />
      </div>
    </header>
  );
};

export default Header;
