"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import Icon from "../ui/Icon";

const TapLink: FC<{ logo: string; href: string }> = ({ href, logo }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`rounded-2xl px-6 py-3 ${
        pathname === href ? "bg-tap-header-gradient" : ""
      }`}
    >
      <Icon width="25px" iconSrc={logo} />
    </Link>
  );
};

export default TapLink;
