import RoutePath from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

import RenderNavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

const Header = () => {
  return (
    <header className="text-xs w-full flex items-center top-0 z-20 bg-gray10 py-3 px-8">
      <Link href={RoutePath.HOME}>
        <Image
          src="/assets/images/navbar/logo.svg"
          width={40}
          height={40}
          alt="unitap"
        />
      </Link>

      <UserAuthStatus />

      <div className="hidden md:flex flex-1"></div>

      <div className="hidden md:flex">
        <RenderNavbarDropdown />
      </div>
    </header>
  );
};

export default Header;
