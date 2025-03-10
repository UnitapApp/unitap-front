"use client";

import {
  AspectRatio,
  Box,
  Button,
  HStack,
  Img,
  Stack,
  Text,
  VStack,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Brands } from "./Brands";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "./Container";

interface HeroProps {
  valuesRef: React.RefObject<HTMLDivElement | null>;
}
export const Hero = ({ valuesRef }: HeroProps) => {
  const [windowHeight, setWindowHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerHeight - ref.current!.clientHeight <= 250) {
        setWindowHeight(window.innerHeight);
      } else {
        setWindowHeight(ref.current!.clientHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const heroTextImageWidth = useBreakpointValue({
    base: 102,
    md: 100,
    lg: 80,
    xl: 147,
  });

  const heroTextImageHeight = useBreakpointValue({
    base: 46,
    md: 62,
    lg: 62,
    xl: 62,
  });

  return (
    <VStack
      ref={ref}
      justifyContent={{ base: "flex-start", xl: "space-between" }}
      // height={`calc(90vh - 64px)`}
      width="full"
      {...(windowHeight && {
        minH: { base: windowHeight, xl: "calc(100vh - 120px)", "2xl": "auto" },
      })}
      position="relative"
    >
      <Container>
        <Box
          display={{ base: "none", xl: "inline-block" }}
          zIndex={2}
          width="full"
          position="absolute"
          top={{ xl: "40%" }}
          right={`min(${14.4 * 8}px,8vw)`}
          transform={{
            xl: "translateY(-40%)",
          }}
          maxW={{
            xl: `min(${14.4 * 40}px,40vw)`,
          }}
        >
          <AspectRatio width="full" ratio={1.42}>
            <Image fill loading="eager" src="/home/hero/hero.png" alt="hero" />
          </AspectRatio>
        </Box>
        <Stack
          flexDirection={{ base: "column", md: "row" }}
          width="full"
          alignItems="flex-start"
          justifyContent={{ base: "center", md: "initial" }}
          whiteSpace="pre-line"
          // pl={{ md: "calc(10vw - 60px)", lg: 0 }}
          pl={{ md: "60px" }}
        >
          <chakra.span
            mt={{ base: "20px", md: "initial" }}
            color="#000"
            fontSize={{
              base: "48px",
              md: "30px",
              lg: "2.5vw",
              xl: `min(${14.4 * 3}px,3vw)`,
            }}
            lineHeight={{
              base: "60px",
              md: "50px",
              lg: "4vw",
              xl: `min(${14.4 * 5}px,5vw)`,
            }}
            fontFamily="plusJakartaSans"
            mx={{ base: "auto", md: "initial" }}
            textAlign={{ base: "center", md: "initial" }}
          >
            <Stack
              justifyContent="center"
              flexDirection={{ base: "column", md: "row" }}
            >
              <Box
                mx={{ base: "auto", md: "initial" }}
                mb={{ base: "7px", md: "0px" }}
              >
                <Image
                  style={{ maxHeight: heroTextImageHeight }}
                  loading="eager"
                  width={heroTextImageWidth ?? 100}
                  height={heroTextImageHeight ?? 100}
                  src="/home/hero/hero-header.png"
                  alt="hero"
                />
              </Box>
              <Text fontWeight="800">Loyalty</Text>
            </Stack>
            <chakra.span fontWeight="300" whiteSpace="nowrap">
              Platform For
            </chakra.span>
            {"\n"}
            <Text fontWeight="800">Web3</Text>
          </chakra.span>
          <VStack mx={{ base: "auto", md: "initial" }}>
            <HStack rowGap="8px">
              <Img
                loading="eager"
                display={{ base: "none", md: "inline-block" }}
                maxW={{
                  md: `min(${14.4 * 8}px,8vw)`,
                  lg: `min(${14.4 * 8}px,8vw)`,
                  xl: "initial",
                }}
                src="/home/hero/arrow.svg"
                alt="arrow"
              />
              <Text
                letterSpacing="-1%"
                color="#000"
                maxW={{ md: "369px", xl: `min(${14.4 * 25}px,25vw)` }}
                fontSize={{
                  base: "18px",
                  md: "14px",
                  lg: "18px",
                  xl: `min(${14.4 * 1.1}px,1.1vw)`,
                }}
                lineHeight={{
                  base: "30.92px",
                  lg: "2vw",
                  xl: `min(${14.4 * 2.4}px,2.4vw)`,
                }}
                fontFamily="nunito"
                fontWeight="400"
                whiteSpace="break-spaces"
                textAlign={{ base: "center", md: "initial" }}
                mt={{ base: "14px", md: "0" }}
              >
                Build and launch marketing campaigns to acquire, retain, and
                engage your community
              </Text>
            </HStack>
          </VStack>
        </Stack>
      </Container>
      <Box
        mx="auto"
        mt="50px"
        alignItems="center"
        display={{ base: "block", md: "none" }}
        zIndex={2}
        width="full"
        position="relative"
        bottom={{
          base: "initial",
        }}
        top={{ base: "0" }}
        left={{ base: "50%" }}
        transform={{
          base: "translateX(-50%) scale(1.2)",
        }}
      >
        <AspectRatio mx="auto" maxWidth="495px" width="full" ratio={1.42}>
          <Image fill loading="eager" src="/home/hero/hero.png" alt="hero" />
        </AspectRatio>
      </Box>
      <VStack
        mt="-40px"
        display={{ base: "inline-block", md: "none" }}
        position="relative"
        zIndex={1}
        border="2px solid #000000"
        width="full"
        background="rgba(253, 255, 196,1)"
        alignItems="flex-start"
        pt="72px"
        pb="34px"
      >
        <chakra.span
          fontSize={{ base: "32px" }}
          fontFamily="plusJakartaSans"
          lineHeight={{ base: "44.48px" }}
          color="#000000"
          textAlign="center"
          pb="12px"
        >
          <Text>Trusted by </Text>

          <chakra.span
            textAlign="center"
            display="inline-block"
            width="full"
            fontWeight="800"
          >
            <chakra.span width="fit-content" bg="#000" color="#FFFFFF">
              $20B
            </chakra.span>
            <chakra.span> ecosystems </chakra.span>
          </chakra.span>
        </chakra.span>
        <Brands />
      </VStack>
      <VStack
        display={{ base: "none", md: "flex" }}
        mt={{ base: "15px", md: "140px", lg: "8vw", xl: "initial" }}
        justifyContent="flex-start"
        width="full"
        px="29px"
      >
        <Button
          mr="auto"
          columnGap="22px"
          variant="unstyled"
          display={{ base: "none", lg: "flex" }}
          onClick={() =>
            valuesRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          mb={{ md: "40px" }}
          mt={{ "2xl": "10%" }}
          ml="147px"
        >
          <Img
            alt="arrow"
            loading="eager"
            src="/home/hero/arrow-down.svg"
            height="full"
          />
          <VStack
            rowGap="0"
            fontSize={{ base: "14px", xl: `min(${14.4}px,1vw)` }}
            lineHeight="24px"
            fontWeight="400"
            fontFamily="nunito"
            alignItems="flex-start"
            color="#00000099"
          >
            <chakra.span>Scroll</chakra.span>
            <Text>to explore </Text>
          </VStack>
        </Button>
        <VStack
          display={{ base: "none", md: "flex" }}
          position="relative"
          zIndex={1}
          border="2px solid #000000"
          width="full"
          background="rgba(253, 255, 196,0.5)"
          alignItems="flex-start"
          // minH={{ xl: "50%" }}
        >
          <Box
            display={{ base: "none", xl: "none", md: "inline-block" }}
            zIndex={2}
            width="full"
            position="absolute"
            bottom={{
              base: "initial",
              md: "150px",
              lg: "130px",
              xl: "initial",
            }}
            top={{ base: "0", md: "initial", xl: "50%" }}
            right={{ base: "50%", md: "0px", xl: `min(${14.4 * 5}px,5vw)` }}
            transform={{
              base: "translateX(50%)",
              md: "initial",
              xl: "translateY(-50%)",
            }}
            maxW={{
              base: "350px",
              md: "450px",
              lg: "45vw",
              xl: "clamp(30vw,30%,80vh)",
            }}
          >
            <AspectRatio width="full" ratio={1.42}>
              <Image
                fill
                loading="eager"
                src="/home/hero/hero.png"
                alt="hero"
              />
            </AspectRatio>
          </Box>
          {/* <Box zIndex={2} position="absolute" bottom="200px" right="84px">
          <Img src="/home/hero/hero.png" alt="hero" />
        </Box> */}

          <chakra.span
            fontSize={{ base: "30px", xl: `min(${14.4 * 2}px,2vw)` }}
            fontFamily="plusJakartaSans"
            lineHeight={{ base: "36px", xl: "initial" }}
            color="#000000"
            pt="30px"
            pl={{ base: "40px", xl: "122px" }}
          >
            <Text>Trusted by </Text>

            <chakra.span fontWeight="800">
              <chakra.span width="fit-content" bg="#000" color="#FFFFFF">
                $20B
              </chakra.span>
              <chakra.span> ecosystems </chakra.span>
            </chakra.span>
          </chakra.span>
          <Brands />
        </VStack>
      </VStack>
    </VStack>
  );
};
