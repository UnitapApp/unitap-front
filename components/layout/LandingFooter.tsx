import { Container } from "@/app/new-landing/components/Container";
import { footerLinks, socialMedias } from "@/constants/footer";
import {
  Center,
  Divider,
  GridItem,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  chakra,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";

export const Footer = () => {
  const firstSection = footerLinks.slice(0, 4);
  const secondSection = footerLinks.slice(4, 8);
  return (
    <VStack
      pb="38px"
      width="full"
      px={{ base: "58px", md: "60px", lg: "150px" }}
      bg="#000000"
      pt="13px"
    >
      <Container px={{ base: "0", md: "initial" }}>
        <Stack
          alignItems={{ base: "center", md: "initial" }}
          justifyContent={{ base: "center", md: "space-between" }}
          flexDirection={{ base: "column", md: "row" }}
          width="full"
          rowGap={{ base: "40px", md: "0px" }}
        >
          <VStack width="fit-content">
            <HStack
              width="full"
              justifyContent={{ base: "center", md: "flex-start" }}
              columnGap="8px"
            >
              <Center boxSize="55px" rounded="full" bg="#FFFFFF3D">
                <Image
                  priority={false}
                  height={31}
                  width={31}
                  src="/new_logo.svg"
                  alt="Unitap"
                />
              </Center>
              <chakra.span
                color="white"
                position="relative"
                fontFamily="Kodchasan"
                fontWeight="600"
                fontSize="33px"
              >
                UNITAP
              </chakra.span>
            </HStack>
            <Text
              textAlign={{ base: "center", md: "left" }}
              fontFamily="Nunito"
              maxW="247px"
              color="white"
              mt={{ base: "16px", md: "33px" }}
              fontSize={{ base: "14px" }}
            >
              Seamless Loyalty Onboarding for the Decentralized Future
            </Text>
          </VStack>
          <SimpleGrid
            color="white"
            fontFamily="Nunito"
            fontSize="16px"
            lineHeight="19px"
            gap="20px"
            columns={{ base: 1, md: 2 }}
          >
            <GridItem
              rowGap="19px"
              alignItems={{ base: "center", md: "flex-start" }}
              as={VStack}
            >
              {firstSection.map((item) => (
                <ChakraLink
                  style={{ textAlign: "left", width: "fit-content" }}
                  key={item.id}
                  href={item.href}
                >
                  {item.title}
                </ChakraLink>
              ))}
            </GridItem>
            <GridItem rowGap="19px" alignItems="flex-start" as={VStack}>
              {secondSection.map((item) => (
                <ChakraLink
                  style={{ textAlign: "left", width: "fit-content" }}
                  key={item.id}
                  href={item.href}
                >
                  {item.title}
                </ChakraLink>
              ))}
            </GridItem>
          </SimpleGrid>
        </Stack>
        <Divider
          border="none"
          my="33px"
          bg="#FFFFFF33"
          height="1px"
          width="full"
        />
        <Stack
          flexDir={{ base: "column", md: "row" }}
          alignItems="center"
          width="full"
          justifyContent="space-between"
          rowGap="18px"
        >
          <HStack order={{ base: "1", md: "0" }} columnGap="7px">
            {socialMedias.map((item) => (
              <ChakraLink
                bg="#D9D9D926"
                boxSize={{ base: "43px", md: "54px" }}
                href={item.href}
                isExternal
                key={item.id}
                display="flex"
                justifyContent="center"
                alignItems="center"
                rounded="full"
              >
                <Box pos="relative" boxSize={{ base: "19px", md: "24px" }}>
                  <Image
                    src={item.icon}
                    fill
                    priority={false}
                    alt={item.title}
                  />
                </Box>
              </ChakraLink>
            ))}
          </HStack>
          <Text
            mx={{ base: "auto", md: "initial" }}
            textAlign={{ base: "center", md: "initial" }}
            fontFamily="Nunito"
            color="white"
            fontSize="14px"
          >
            © Copyright 2025. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </VStack>
  );
};
