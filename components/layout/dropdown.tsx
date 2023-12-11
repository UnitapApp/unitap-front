"use client";

import { useOutsideClick } from "@/utils/hooks/dom";
import RoutePath from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useRef } from "react";
import { useState } from "react";

const RenderNavbarDropdown = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <span className="ml-auto cursor-pointer">
      <Image
        src="/assets/images/navbar/navbar-dropdown-icon.svg"
        width={31}
        height={31}
        alt="unitap menu"
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      />
      {isDropdownVisible && (
        <NavbarDropdown
          closeDropdown={() => setIsDropdownVisible(false)}
          className="navbar__dropdown__component"
        />
      )}
    </span>
  );
};

type NavbarDropdownProps = {
  className: string;
  closeDropdown: Function;
};

const navItems = [
  {
    name: "Home",
    link: RoutePath.HOME,
    icon: "/assets/images/navbar/navbar-dropdown-home.svg",
    iconWidth: "auto",
    iconHeight: "28px",
    route: RoutePath.HOME,
  },
  {
    name: "Gas Tap",
    link: RoutePath.FAUCET,
    icon: "/assets/images/navbar/navbar-dropdown-gas-tap.svg",
    iconWidth: "auto",
    iconHeight: "28px",
    route: RoutePath.FAUCET,
  },
  {
    name: "Token Tap",
    link: RoutePath.TOKEN,
    icon: "/assets/images/navbar/navbar-dropdown-token-tap.svg",
    iconWidth: "auto",
    iconHeight: "28px",
    route: RoutePath.TOKEN,
  },
  {
    name: "Prize Tap",
    link: RoutePath.PRIZE,
    icon: "/assets/images/landing/prizetap-icon.png",
    iconWidth: "33px",
    iconHeight: "auto",
    route: RoutePath.PRIZE,
  },
];

const NavbarDropdown = ({ className, closeDropdown }: NavbarDropdownProps) => {
  const path = usePathname();

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => closeDropdown());

  return (
    <div
      ref={ref}
      className={`absolute z-10 top-14 right-8 cursor-default bg-gray20 rounded-lg border-2 px-3 pb-1 pt-2.5 border-gray00 ${
        className ? className : ""
      }`}
    >
      {navItems.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.link}
            onClick={() => closeDropdown()}
            className={`w-52 flex items-center h-11 justify-between bg-gray30 rounded-lg border-2 px-4 mb-2 cursor-pointer transition-all duration-75 ${
              path === item.route
                ? "bg-gray10 rounded-lg border-gray100 px-4 mb-2"
                : item.link && "hover:bg-gray20 border-gray40"
            } ${!item.link && "cursor-default"}`}
          >
            <p
              className={`text-sm font-semibold ${
                path === item.route
                  ? "bg-primaryGradient text-transparent bg-clip-text"
                  : "text-white"
              }`}
            >
              {item.name}
            </p>
            <img
              alt={item.name}
              src={item.icon}
              width={item.iconWidth}
              height={item.iconHeight}
            />
          </Link>
        );
      })}

      <Link
        onClick={() => closeDropdown()}
        href={RoutePath.NFT}
        className={`navbar-dropdown__item cursor-pointer bg-g-primary relative z-10 before:content-[''] p-1 rounded-xl overflow-hidden before:block before:-z-10 before:absolute before:inset-[2px] before:rounded-lg before:bg-gray00 flex items-center justify-between !h-auto bg-gray00 transition-all duration-75 hover:bg-gray20 border-gray00 pl-4 pr-2 py-2.5 mt-12`}
      >
        <p className="text-sm font-semibold bg-primaryGradient text-transparent bg-clip-text">
          Unitap Pass NFT
        </p>
        <img
          src="/assets/images/navbar/navbar-dropdown-mint.svg"
          width="auto"
          height="26px"
        />
      </Link>
    </div>
  );
};

export default RenderNavbarDropdown;
