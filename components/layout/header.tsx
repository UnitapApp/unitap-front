import RoutePath from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";

import RenderNavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

const Header = () => {
  return (
    <header className="top-0 z-20 flex w-full items-center px-8 py-14 text-xs dark:bg-gray10">
      <Link href={"/"}>
        <Image
          src="/assets/images/landing/unitap-logo.svg"
          width={182}
          height={54}
          alt="unitap"
        />
      </Link>

      <div className="hidden flex-1 md:flex"></div>

      <UserAuthStatus />
      <div className="hidden md:flex">
        <RenderNavbarDropdown />
      </div>
    </header>
  );
};

export default Header;
