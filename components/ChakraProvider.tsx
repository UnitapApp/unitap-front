"use client";

import { baseTheme } from "@/app/theme";
import { ChakraProvider } from "@chakra-ui/react";

export function ChakraUIProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={baseTheme}>{children}</ChakraProvider>;
}
