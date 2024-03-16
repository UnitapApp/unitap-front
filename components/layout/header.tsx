import RenderNavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";
import TapLink from "./tapLink";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

const Header = () => {
  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between px-8 py-3 text-xs backdrop-blur-md">
      <UserAuthStatus />

      <div className="absolute left-1/2 hidden -translate-x-1/2 justify-self-center lg:flex">
        <div className="flex items-center gap-1 rounded-2xl border border-gray70 bg-gray30 p-[1px]">
          <TapLink
            href="/"
            alt="unitap-home"
            logo="/assets/images/main-logo.svg"
          />
          <TapLink
            href="/gastap"
            alt="gastap"
            logo="/assets/images/gastap-logo.svg"
          />
          <TapLink
            href="/learntap"
            alt="learntap"
            logo="/assets/images/learntap-logo.svg"
          />
          <TapLink
            href="/tokentap"
            alt="tokentap"
            logo="/assets/images/tokentap-logo.svg"
          />
          <TapLink
            href="/prizetap"
            alt="prizetap"
            logo="/assets/images/prizetap-logo.svg"
          />
        </div>
      </div>

      <RenderNavbarDropdown />
    </header>
  );
};

export default Header;
