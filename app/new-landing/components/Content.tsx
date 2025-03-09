"use client";
import { Box } from "@chakra-ui/react";
import { Values } from "./Values";
import { Features } from "./Features";
import { Web3 } from "./Web3";
import { RefObject } from "react";
import { Container } from "./Container";

interface ContentProps {
  valuesRef: RefObject<HTMLDivElement | null>;
}
export const Content = ({ valuesRef }: ContentProps) => {
  return (
    <>
      <Box
        backgroundRepeat="repeat-x"
        backgroundImage="url(/home/desktop-pattern.png)"
        width="full"
      >
        <Container>
          <Box ref={valuesRef} />
          <Values />
        </Container>
      </Box>
      <Box
        width="full"
        backgroundRepeat="repeat"
        backgroundImage="url(/home/desktop-pattern.png)"
      >
        <Container>
          <Features />
        </Container>
      </Box>
      <Box
        backgroundRepeat="repeat"
        backgroundImage="url(/home/desktop-pattern.png)"
        width="full"
      >
        <Web3 />
      </Box>
    </>
  );
};
