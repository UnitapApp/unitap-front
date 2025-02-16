"use client";

import { FC, PropsWithChildren } from "react";
import Icon from "../ui/Icon";
import Link from "next/link";
import Image from "next/image";
import { Nunito_Sans } from "next/font/google";
import { BsTelegram, BsTwitterX, BsYoutube } from "react-icons/bs";
import { DiGithubAlt } from "react-icons/di";

const nunitoSans = Nunito_Sans({
  weight: ["200", "300", "400", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

export const FooterItem: FC<PropsWithChildren & { href: string }> = ({
  href,
  children,
}) => {
  return (
    <Link
      target="_blank"
      className="grid h-11 w-11 place-items-center rounded-full bg-stone-700 p-1"
      href={href}
    >
      {children}
    </Link>
  );
};

const Footer: FC = () => {
  return (
    <footer className={`bg-black-0 p-20 text-white ${nunitoSans.className}`}>
      <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
        <div className="">
          <Image
            src="/assets/images/landing/unitap-footer.png"
            alt="unitap team"
            width={228}
            height={67}
          />

          <p className="mt-10 max-w-xs text-sm">
            Imagine your campaign, build in using Unitap, seamlessly acquire,
            retain and engage your community
          </p>
        </div>
        <div className="flex flex-col gap-y-6">
          <Link href="/about">Why Unitap?</Link>
          <Link href="/about">About Us</Link>
          <Link href="/about">Contact Us</Link>
          <Link href="/github">Github</Link>
        </div>
        <div className="flex flex-col gap-y-6">
          <Link href="/faq">FAQ's</Link>
          <Link href="/about">Privacy & Policy</Link>
          <Link href="/about">Terms Of Service</Link>
        </div>
      </div>
      <div className="col-span-3">
        <hr className="my-10 border border-stone-900" />

        <div className="flex flex-wrap items-center gap-2">
          <FooterItem href="https://t.me/unitap_app">
            <BsTelegram size={25} />
          </FooterItem>
          <FooterItem href="https://twitter.com/unitap_app">
            <BsTwitterX size={25} />
          </FooterItem>
          <FooterItem href="https://github.com/UnitapApp">
            <DiGithubAlt size={25} />
          </FooterItem>
          <FooterItem href="https://www.youtube.com/@UnitapApp?sub_confirmation=1">
            <BsYoutube size={25} />
          </FooterItem>
          <p className="ml-auto text-sm">
            Copyright {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
