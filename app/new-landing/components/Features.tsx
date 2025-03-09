import {
  chakra,
  GridItem,
  Heading,
  Img,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { featuresData } from "../constants";

interface FeatureItemProps {
  feature: { id: number; img: string; title: string; description: string };
}
const FeatureItem = ({ feature }: FeatureItemProps) => {
  return (
    <Stack
      flexDirection={{ base: "column", md: "row" }}
      width="full"
      columnGap="13px"
      border="2px solid #000"
      boxShadow={{
        base: "4px 5px 0px 0px #000000",
        md: "8px 9px 0px 0px #000000",
      }}
      p={{ base: "24px 16px", md: "45px 26px" }}
      backgroundImage="url('/home/features/dot-pattern.png')"
      backgroundRepeat="repeat"
      backgroundPosition="center"
    >
      <Img
        loading="lazy"
        src={feature.img}
        alt={feature.title}
        width={{ base: "86px", md: "100px", lg: "173px" }}
        height={{ lg: "163px" }}
      />
      <VStack color="#000" rowGap="9px" alignItems="flex-start" maxW="349px">
        <Text
          fontFamily="plusJakartaSans"
          fontSize={{ base: "20px", md: "24px" }}
          fontWeight="700"
          lineHeight={{ base: "24px", md: "30px" }}
        >
          {feature.title}
        </Text>
        <Text
          fontFamily="Nunito"
          fontSize={{ base: "14px", md: "16px" }}
          lineHeight={{ base: "24px", md: "27px" }}
        >
          {feature.description}
        </Text>
      </VStack>
    </Stack>
  );
};

export const Features = () => {
  return (
    <VStack mt="32px" width="full">
      <VStack width="full" alignItems="center">
        <chakra.span
          textAlign="center"
          fontFamily="plusJakartaSans"
          color="black"
          fontSize={{ base: "24px", md: "34px" }}
          fontWeight="400"
          lineHeight={{ base: "26px", md: "37px" }}
        >
          <Heading
            pt="8px"
            fontSize={{ base: "48px", md: "74px" }}
            lineHeight={{ base: "52px", md: "80px" }}
            fontWeight="800"
          >
            Fea
            <chakra.span color="white" bg="black">
              tures
            </chakra.span>
          </Heading>
        </chakra.span>

        <chakra.span
          pt={{ base: "24px", md: "28px" }}
          color="black"
          fontSize={{ base: "14px", md: "18px" }}
          lineHeight={{ base: "24px", md: "31px" }}
          maxW="533px"
          textAlign="center"
          fontFamily="Nunito"
        >
          Unitap provides a turnkey solution for Web3 user engagement and
          onboarding going far beyond the limitations{" "}
          <chakra.span display="block" >of current platforms.</chakra.span>
        </chakra.span>
      </VStack>
      <SimpleGrid
        width={{ base: "full", md: "initial" }}
        gap={{ base: "8px", md: "36px" }}
        mt={{ base: "24px", md: "73px" }}
        columns={{ base: 1, md: 2 }}
      >
        {featuresData.map((feature, index) => (
          <GridItem
            width="full"
            bg="white"
            display="flex"
            alignItems="stretch"
            colSpan={1}
            key={feature.id}
            transform={{
              md:
                index === 1
                  ? "rotate(2deg)"
                  : index === 2
                  ? "rotate(-2deg)"
                  : "rotate(0deg)",
            }}
          >
            <FeatureItem feature={feature} />
          </GridItem>
        ))}
      </SimpleGrid>
    </VStack>
  );
};
