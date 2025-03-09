"use client";
import { extendTheme } from "@chakra-ui/react";
import { Kodchasan, Nunito, Plus_Jakarta_Sans } from "next/font/google";

const kodchasan = Kodchasan({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const baseTheme = extendTheme({
  fonts: {
    kodchasan: kodchasan.style.fontFamily,
    nunito: nunito.style.fontFamily,
    plusJakartaSans: plusJakartaSans.style.fontFamily,
  },
  styles: {
    global: {
      body: {
        width: "100%",
        fontFamily: "kodchasan",
        backgroundColor: "white",
        overflowX: "hidden",
      },
      html: {
        width: "100%",
        overflowX: "hidden",
      },
    },
  },
});
