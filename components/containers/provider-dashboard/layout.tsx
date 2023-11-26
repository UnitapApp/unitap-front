"use client"

import { FC, PropsWithChildren } from "react"
import Header from "./Header"
import { usePathname } from "next/navigation"
import RoutePath from "@/utils/routes"
import Icon from "@/components/ui/Icon"
import Link from "next/link"

const ProviderDashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      <ProviderTabs />

      {children}
    </>
  )
}

const ProviderTabs: FC = () => {
  const pathname = usePathname()

  const borderPosition =
    pathname === RoutePath.PROVIDER_GASTAP
      ? "after:left-0"
      : pathname == RoutePath.PROVIDER_TOKENTAP
      ? "after:left-[33.3%]"
      : "after:left-[66.6%]"

  return (
    <div
      className={`${borderPosition} mb-4 select-not relative rounded-t-xl after:transition-all transition after:duration-[1s] ease-in-out  after:border after:absolute after:w-[33%] after:bottom-[-1.5px] flex bg-gray20 justify-between text-center text-white font-semibold border-b-2  border-gray80`}
    >
      <Link
        className={`w-full p-3 flex flex-col-reverse sm:flex-row gap-2 items-center transition duration-[1s] delay-260 ease-in-out cursor-pointer justify-center ${
          pathname === RoutePath.PROVIDER_GASTAP
            ? " text-white"
            : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_GASTAP}
      >
        Gas Tap <Icon iconSrc="/assets/images/provider-dashboard/gas-tap.svg" />
      </Link>
      <Link
        className={`w-full p-3 flex flex-col-reverse sm:flex-row  gap-2 items-center transition duration-[1s] delay-260 ease-in-out cursor-pointer justify-center ${
          pathname === RoutePath.PROVIDER_TOKENTAP
            ? " text-white"
            : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_TOKENTAP}
      >
        Token Tap{" "}
        <Icon iconSrc="/assets/images/provider-dashboard/token-tap.svg" />
      </Link>
      <Link
        className={`w-full p-3 flex flex-col-reverse sm:flex-row  gap-2 items-center transition duration-[1s] delay-260 ease-in-out cursor-pointer justify-center ${
          pathname === RoutePath.PROVIDER_PRIZETAP
            ? " text-white opacity-1"
            : "opacity-[0.2]"
        }`}
        href={RoutePath.PROVIDER_PRIZETAP}
      >
        Prize Tap
        <Icon iconSrc="/assets/images/provider-dashboard/prize-tap.svg" />
      </Link>
    </div>
  )
}

export default ProviderDashboardLayout
