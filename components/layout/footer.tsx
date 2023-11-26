"use client"

import { FC } from "react"
import Icon from "../ui/Icon"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Footer: FC = () => {
  const path = usePathname()

  if (path === "/") return null

  return (
    <footer className="items-center w-full justify-center bg-gray10 h-16 p-3 hidden md:flex">
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
          hoverable
        ></Icon>
      </Link>
      <Icon
        className="md:static hidden !absolute right-10"
        iconSrc="/Poweredbybright.svg"
        width="160px"
        height="auto"
      ></Icon>
    </footer>
  )
}

export default Footer
