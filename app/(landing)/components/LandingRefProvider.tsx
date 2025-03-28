"use client";
import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import { Container } from "./Container";
import { Hero } from "./Hero";
import { Content } from "./Content";

export const LandingRefProvider = () => {
  const valuesRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box
        width="full"
        backgroundRepeat="repeat"
        backgroundImage="url(/home/desktop-pattern.png)"
      >
        <Container>
          <Hero valuesRef={valuesRef} />
        </Container>
      </Box>
      <Content valuesRef={valuesRef} />
    </>
  );
};
