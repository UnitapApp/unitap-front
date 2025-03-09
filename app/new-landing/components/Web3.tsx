import { Box, Button, Img, Text, VStack, chakra } from "@chakra-ui/react";
import { Container } from "./Container";

const AcademyButton = () => (
  <Button
    fontSize={{ base: "14px", md: "18px" }}
    maxW={{ base: "full", lg: "400px", xl: "512px" }}
    height={{ base: "54px", md: "64px" }}
    mt={{ base: "16px", md: "28px" }}
    bg="#FCB2FF"
    width="full"
    color="#000"
    textTransform="uppercase"
    boxShadow="4px 6px 0px 0px #000000, 0px 2px 0px 0px #FFFFFF inset"
    border="2px solid black"
    fontFamily="Nunito"
    fontWeight="700"
    mb={{ base: "173px", md: "103px", lg: "initial" }}
    borderRadius="36px"
  >
    {/* Launch Unitap Academy */}
    Coming soon
  </Button>
);
export const Web3 = () => {
  return (
    <VStack
      mb={{ base: "103px", md: "67px" }}
      position="relative"
      width="full"
      px={{ base: "0", md: "26px" }}
    >
      <Container px={{ base: "0", md: "inherit" }} zIndex={1}>
        <VStack
          position="relative"
          border="2px solid #000"
          bg="#CCD1FF"
          mt="153px"
          width="full"
          boxShadow="0px 4px 0px 0px #FFFFFF inset"
          pb="67px"
          backgroundImage="/home/web3/web3-pattern.png"
          backgroundSize={{ base: "cover", md: "100% 100%" }}
          backgroundPosition="center bottom"
          backgroundRepeat="no-repeat"
          px="16px"
          rowGap="0"
        >
          <Img
            src="/home/web3/plug-play-large.png"
            position="absolute"
            bottom="-42px"
            left={{ base: "16px", lg: "48px" }}
            width={{ base: "150px", lg: "277px" }}
            height={{ base: "147px", lg: "224px" }}
            alt="plug-play"
            loading="lazy"
          />

          <Img
            position="absolute"
            bottom="0"
            right="0"
            width="full"
            maxW={{ base: "150px", md: "200px", lg: "250px", "2xl": "300px" }}
            zIndex={2}
            src="/home/features/decentralized-large.png"
            alt="decentralized"
            loading="lazy"
          />

          <Img
            position="absolute"
            width={{ base: "122px", md: "164px" }}
            height={{ base: "140px", md: "188px" }}
            src="/home/web3/star.png"
            top="-94px"
            transform="translate(-50%)"
            left="50%"
            alt="star"
            loading="lazy"
          />
          <chakra.span
            fontFamily="plusJakartaSans"
            pt={{ base: "103px", md: "137px" }}
            lineHeight="64px"
            fontSize={{ base: "32px", md: "52px" }}
            color="black"
            textAlign="center"
          >
            From <chakra.span fontWeight="600">Web2</chakra.span> to
            <chakra.span background="#000" fontWeight="600" color="white">
              {" "}
              Web3!
            </chakra.span>
          </chakra.span>
          <Text
            color="black"
            fontSize="18px"
            lineHeight="31px"
            textAlign="center"
            maxW={{ md: "450px", lg: "480px", xl: "776px" }}
            mt={{ base: "16px", md: "28px" }}
            fontWeight="400"
            fontFamily="Nunito"
          >
            At Unitap, we believe the future of loyalty lies in bridging the gap
            between Web2 and Web3. Our platform is designed not only to retain
            and engage existing Web3 users but also to onboard entirely new
            audiences from Web2.
          </Text>
          <AcademyButton />
        </VStack>
      </Container>
      <Box
        margin="0"
        position="absolute"
        bottom={{ base: "-104px", md: "-68px" }}
        width="full"
        height="130px"
        zIndex={0}
        bg="#000"
      />
    </VStack>
  );
};
