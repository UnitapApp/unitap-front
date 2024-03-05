import RenderNavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";
import TapLink from "./tapLink";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

const Header = () => {
  return (
    <header className="text-xs backdrop-blur-md sticky w-full flex items-center justify-center top-0 z-20 py-3 px-8">
      <UserAuthStatus />

      <div className="hidden md:flex -translate-x-1/2">
        <div className="bg-gray30 p-[1px] border border-gray70 flex items-center rounded-2xl gap-1">
          <TapLink href="/" logo="/assets/images/main-logo.svg" />
          <TapLink href="/gastap" logo="/assets/images/gastap-logo.svg" />
          <TapLink href="/learntap" logo="/assets/images/learntap-logo.svg" />
          <TapLink href="/tokentap" logo="/assets/images/tokentap-logo.svg" />
          <TapLink href="/prizetap" logo="/assets/images/prizetap-logo.svg" />
        </div>
      </div>

      <div className="hidden ml-auto md:flex">
        <RenderNavbarDropdown />
      </div>
    </header>
  );
};

export default Header;
