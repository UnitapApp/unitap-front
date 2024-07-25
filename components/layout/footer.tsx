"use client";

import { FC } from "react";
import Icon from "../ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer: FC = () => {
  const path = usePathname();

  if (path === "/") return null;

  return (
    <footer className="hidden h-16 w-full items-center justify-center bg-gray10 p-3 md:flex">
      <Link href="https://t.me/unitap_app" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/telegram.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>

      <Link href="http://twitter.com/unitap_app" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/twitter.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>

      <Link href="https://github.com/UnitapApp" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/github.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>
      <Link href="https://discord.gg/unitap" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/discord.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>
      <Link
        href="https://www.youtube.com/@UnitapApp?sub_confirmation=1"
        target="_blank"
      >
        <Icon
          iconSrc="/assets/images/footer/youtube.svg"
          width="34px"
          height="auto"
          hoverable
        ></Icon>
      </Link>
      <Icon
        className="!absolute right-10 hidden md:static"
        iconSrc="/Poweredbybright.svg"
        width="160px"
        height="auto"
      ></Icon>
    </footer>
  );
};

export default Footer;
