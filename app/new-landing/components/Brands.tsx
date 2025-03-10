import { VStack } from "@chakra-ui/react";
import { heroBrands } from "../constants";
import dynamic from "next/dynamic";

const BrandsSwiper = dynamic(
  () => import("./BrandSwiper").then((mod) => mod.BrandsSwiper),
  { ssr: false }
);

export const Brands = () => {
  const firstRow = heroBrands.slice(0, 9);
  const secondRow = heroBrands.slice(9, 18);
  return (
    <VStack rowGap="0" mt="24px" width="full">
      <VStack
        overflow="hidden"
        rowGap="8px"
        mb={{ md: "20px" }}
        width="full"
        transform="rotate(-1deg)"
      >
        <BrandsSwiper key="firstBrands" brands={firstRow} />
        <BrandsSwiper key="secondBrands" brands={secondRow} reverse />
      </VStack>
    </VStack>
  );
};
