import {
  AspectRatio,
  Box,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { values } from "../constants";
import Image from "next/image";

interface ValueProps {
  img: {
    ratio: { base: number; md: number };
    src: { base: string; md: string };
    mx?: string | number;
    mb?: { base: string | number; md: string | number };
  };
  title: ReactNode;
  description: string;
  arrow?: ReactNode;
  reverse?: boolean;
}
const Value = ({ description, img, title, reverse, arrow }: ValueProps) => {
  const deviceMode = useBreakpointValue({ base: "base", md: "md" }) as
    | "base"
    | "md";
  const [windowHeight, setWindowHeight] = useState("auto");

  useEffect(() => {
    const updateHeight = () =>
      setWindowHeight(() =>
        window.innerHeight > window.innerWidth
          ? "fit-content"
          : `max(${window.innerHeight / 2 - 50}px,fit-content)`
      );

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Stack
      flexDirection={{ base: "column", md: reverse ? "row-reverse" : "row" }}
      columnGap={{ lg: "50px", xl: "150px" }}
      alignItems="center"
      justifyContent="center"
      width="full"
      rowGap="0"
      height={{
        md: windowHeight,
      }}
    >
      {typeof img.src !== "undefined" && (
        <AspectRatio
          width="full"
          maxW={{ base: "360px", md: "300px", lg: "500px" }}
          ratio={img.ratio[deviceMode]}
          mb={img.mb}
        >
          <Image
            fill
            placeholder="empty"
            alt="value"
            loading="lazy"
            quality={75}
            src={img.src[deviceMode]}
            style={{ objectFit: "contain" }}
          />
        </AspectRatio>
      )}
      <VStack
        rowGap="0"
        width={{ base: "full", md: "fit-content" }}
        position="relative"
      >
        <Box width="full">
          {title}
          <Text
            width={{ base: "full", md: "initial" }}
            textAlign={{ base: "center", md: "initial" }}
            color="#000"
            marginTop={{ base: "16px", md: "20px" }}
            lineHeight={{ base: "24px", md: "30.92px" }}
            fontSize={{ base: "14px", md: "16px", lg: "18px" }}
            fontWeight="400"
            maxW={{ md: "450px" }}
            fontFamily="nunito"
            mr={{ base: "initial", md: "auto" }}
          >
            {description}
          </Text>
        </Box>
        {arrow}
      </VStack>
    </Stack>
  );
};

export const Values = () => {
  return (
    <VStack
      rowGap={{ base: "20px", md: "40px", lg: "100px" }}
      width="full"
      marginTop={{ base: "38px", md: "90px" }}
    >
      {values.map((value) => (
        <Value key={value.id} {...value} />
      ))}
    </VStack>
  );
};
