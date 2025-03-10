"use client";

import { VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Container } from "../new-landing/components/Container";

const Insight = dynamic(
  () => import("./_components/Insight").then((modules) => modules.Insight),
  { ssr: false },
);
const Mission = dynamic(() =>
  import("./_components/Mission").then((modules) => modules.Mission),
);

const AboutSection = dynamic(() =>
  import("./_components/About").then((modules) => modules.AboutSection),
);

const Team = dynamic(() =>
  import("./_components/Team").then((modules) => modules.Team),
);

export const About = () => {
  return (
    <VStack
      backgroundRepeat="repeat"
      backgroundImage="url(/home/desktop-pattern.png)"
      mb="24px"
      px={{ md: "29px" }}
      width="full"
    >
      <Container as={VStack} rowGap="60px">
        <AboutSection />
        <Mission />
        <Insight />
        <Team />
      </Container>
    </VStack>
  );
};

export default About;
