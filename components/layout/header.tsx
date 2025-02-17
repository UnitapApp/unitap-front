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
    <header className="top-0 z-20 flex w-full flex-wrap items-center justify-center gap-y-4 px-8 py-14 text-xs dark:bg-gray10">
      <Link href={"/"}>
        <Image
          src="/assets/images/landing/unitap-logo.svg"
          width={182}
          height={54}
          alt="unitap"
        />
      </Link>

      <div className="hidden flex-1 md:flex"></div>

      <Link href={"/incentive-center"}>
        <LandingButton className="relative z-20 flex bg-landing-secondary px-5 py-3 text-base uppercase">
          Incentive center
        </LandingButton>
      </Link>
      <UserAuthStatus />
    </header>
  );
};

export default Header;
