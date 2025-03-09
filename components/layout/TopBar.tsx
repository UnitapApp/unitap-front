"use client";
import {
  Box,
  Button,
  Center,
  HStack,
  Img,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "../../app/new-landing/components/Container";

const AppButton = () => {
  return (
    <Button
      as="a"
      href="https://dashboard.unitap.app/quest"
      width={{ base: "130px", md: "184px" }}
      height={{ base: "40px", md: "64px" }}
      textTransform="uppercase"
      bg="#FCB2FF"
      position="relative"
      borderRadius="36px"
      p="0"
      m="0"
      fontSize={{ base: "14px", md: "18px" }}
      boxShadow="4px 6px 0px 0px #000000, 0px 4px 0px 0px #FFFFFF inset"
      border="1px solid black"
      _before={{
        position: "absolute",
        content: '""',
        bg: "transparent",
        bottom: "0",
        left: "0",
        height: "full",
        width: "full",
        borderRadius: "36px",
      }}
    >
      open app
    </Button>
  );
};

export const TopBar = () => {
  return (
    <Box
      width="full"
      backgroundRepeat="repeat"
      backgroundImage="url(/home/desktop-pattern.png)"
      pb={{ base: "72px", md: "30px" }}
      pt={{ base: "32px", md: "20px" }}
    >
      <Container width="full">
        <HStack px="29px" width="full" justifyContent="space-between">
          <Link href="/">
            <HStack columnGap="7px">
              <Center
                rounded="full"
                boxSize={{ base: "31px", md: "44px" }}
                bg="black"
              >
                <Img
                  width={{ base: 18, md: 25 }}
                  height={{ base: 18, md: 25 }}
                  src="/new_logo.svg"
                  alt="Unitap"
                />
              </Center>
              <Text
                position="relative"
                fontFamily="Kodchasan"
                fontWeight="600"
                fontSize={{ base: "19px", md: "27px" }}
              >
                UNITAP
              </Text>
            </HStack>
          </Link>
          <AppButton />
        </HStack>
      </Container>
    </Box>
  );
};
