"use client";

import { usePathname } from "next/navigation";
import { ChakraUIProviders } from "./ChakraProvider";
import { HeaderSelection } from "./HeaderSelection";
import { PropsWithChildren } from "react";
import "swiper/css";
import Footer from "./layout/footer";
import { Footer as LandingFooter } from "./layout/LandingFooter";

export const ProviderSelection = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const hideMainHeaderRoutes = ["/about", "/"];
  return hideMainHeaderRoutes.includes(pathname) ? (
    <ChakraUIProviders>
      <HeaderSelection />
      {children}
      <LandingFooter />
    </ChakraUIProviders>
  ) : (
    <div
      id="app"
      className="m-auto min-h-[calc(100vh_-_130px)] w-full max-w-screen-2xl"
    >
      <HeaderSelection />
      <main className="flex flex-col px-4 py-14 sm:px-6 lg:px-8 xl:px-40 xl1440:px-60">
        {children}
      </main>
      <Footer />
    </div>
  );
};
