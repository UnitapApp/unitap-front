"use client";

import Image from "next/image";
import Link from "next/link";
// import { Kodchasan } from "next/font/google";

import dynamic from "next/dynamic";
import LandingButton from "../containers/landing/button";

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false });

// const nunitoFont = Kodchasan({
//   weight: ["600"],
//   display: "swap",
//   adjustFontFallback: false,
//   subsets: ["latin"],
// });

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

      <LandingButton className="bg-landing-secondary relative z-20 flex px-5 py-3 text-base">
        Incentive center
      </LandingButton>
      <UserAuthStatus />
    </header>
  );
};

export default Header;
