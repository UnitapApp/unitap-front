"use client";

import { PropsWithChildren } from "react";

import "swiper/css";
import { HeaderSelection } from "@/components/HeaderSelection";
import { ChakraUIProviders } from "@/components/ChakraProvider";
import { Footer } from "@/components/layout/LandingFooter";

export default function LandingLayout({ children }: PropsWithChildren) {
  return (
    <ChakraUIProviders>
      <HeaderSelection />
      {children}
      <Footer />
    </ChakraUIProviders>
  );
}
