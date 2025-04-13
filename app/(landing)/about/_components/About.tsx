import { AspectRatio, Box, chakra } from "@chakra-ui/react";
import Image from "next/image";

export const AboutSection = () => {
  return (
    <chakra.span
      fontSize={{ base: "16px", md: "20px" }}
      fontFamily="plusJakartaSans"
      fontWeight="400"
      flex="1"
      lineHeight={{ base: "28px ", md: "45px" }}
      textAlign="justify"
    >
      <chakra.span columnGap="6px" display="flex" alignItems="center">
        <chakra.span>
          <chakra.span
            fontWeight="800"
            width="full"
            fontSize={{ base: "28px", md: "36px" }}
          >
            <Box
              display="inline-block"
              marginRight="8px"
              position="relative"
              width={{ base: "35px", md: "56px" }}
              height={{ base: "16px", md: "31px" }}
              alignSelf="center"
              rounded="full"
            >
              <Image src="/home/hero/hero-header.png" alt="heading" fill />
            </Box>
            Unitap
          </chakra.span>{" "}
          is a revolutionary loyalty platform built exclusively for Web3
          projects. Leveraging the power of blockchain, intelligent automation,
          and real-time analytics, Unitap enables projects to design and deploy
          dynamic engagement campaigns. Whether rewarding on-chain or off-chain
          interactions, our platform lets you create personalized
          incentives—ranging from points and enrollment flags to exclusive
          badges—to drive meaningful user engagement. With a robust rule engine
          and AI-powered support, Unitap transforms how decentralized projects
          nurture lasting relationships with their communities.
        </chakra.span>
        <Box
          display={{ xl: "flex", base: "none" }}
          position="relative"
          minWidth="380px"
          width="380px"
          mr="12px"
          height="full"
        >
          <AspectRatio width="full" ratio={1.4}>
            <Image src="/home/hero/hero.png" alt="hero" fill />
          </AspectRatio>
        </Box>
      </chakra.span>
    </chakra.span>
  );
};
