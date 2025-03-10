import {  VStack } from "@chakra-ui/react";
import { LandingRefProvider } from "./components/LandingRefProvider";


export default function Home() {
  return (
    <VStack alignItems="flex-start">
      <LandingRefProvider />
    </VStack>
  );
}
