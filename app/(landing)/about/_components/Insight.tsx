"use client";

import { Box, chakra, Stack, Text, VStack } from "@chakra-ui/react";
import { insights } from "../constants";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCountUp } from "react-countup";
import { RefObject, useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface InsightItemProps {
  count: number;
  title: string;
  iconSrc: string;
  suffix?: string;
  prefix?: string;
  isIntersecting: boolean;
}
const InsightItem = ({
  count,
  title,
  iconSrc,
  suffix,
  prefix,
  isIntersecting,
}: InsightItemProps) => {
  const countUpRef = useRef<string | HTMLSpanElement>("");

  const { start } = useCountUp({
    ref: countUpRef as string | RefObject<HTMLElement>,
    start: 0,
    end: count,
    delay: 0,
    duration: 2,
  });

  useEffect(() => {
    if (isIntersecting) {
      start();
    }
  }, [isIntersecting]);

  return (
    <VStack zIndex={1}>
      <Box
        width={{ base: "100px", md: "150px" }}
        height={{ base: "80px", md: "140px" }}
        position="relative"
      >
        <Image alt="insight" fill src={iconSrc} />
      </Box>
      <chakra.span fontSize="32px" fontWeight="800" fontFamily="nunito">
        <chakra.span>{prefix}</chakra.span>
        <chakra.span ref={countUpRef as RefObject<HTMLSpanElement>}>
          {count}
        </chakra.span>
        <chakra.span>{suffix}</chakra.span>
      </chakra.span>
      <Text fontSize="22px">{title}</Text>
    </VStack>
  );
};

export const Insight = () => {
  const { ref, isIntersecting } = useIntersectionObserver(false, {
    threshold: 0.2,
  });
  console.log(isIntersecting);

  return (
    <VStack width="full" position="relative">
      <chakra.span
        fontSize={{ base: "30px", md: "34px" }}
        fontWeight="800"
        fontFamily="plusJakartaSans"
        textAlign="center"
        mb="24px"
        display="inline-block"
      >
        Discover real-time insights
        <chakra.span display="block">
          into how Unitap is elevating user engagement
        </chakra.span>
        across the Web3 landscape.
      </chakra.span>
      <Stack
        backgroundColor="white"
        ref={ref}
        overflow="hidden"
        backgroundImage="url('/home/features/dot-pattern.png')"
        flexDirection={{ base: "column", md: "row" }}
        borderRadius="4px"
        border="1px solid black"
        width="full"
        justifyContent={{ md: "space-between" }}
        p={{ base: "16px", md: "40px" }}
        position="relative"
        boxShadow="4px 6px 0px black"
      >
        <motion.div
          animate={{
            x: [10, 500, 100, 1000],
            y: [100, 20, 400, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse",
          }}
          initial={{ position: "absolute", x: 0, y: 0 }}
        >
          <Box
            zIndex={-1}
            width="10px"
            height="10px"
            bg="yellow"
            opacity={0.1}
            boxShadow="0px 0px 100px 100px yellow"
            rounded="full"
          />
        </motion.div>
        <motion.div
          animate={{
            x: [100, -500, -200, -1000],
            y: [0, 20, 100, 500, 0],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse",
          }}
          initial={{ position: "absolute", x: 0, y: 0, right: 0 }}
        >
          <Box
            zIndex={-1}
            width="10px"
            height="10px"
            bg="blue"
            opacity={0.1}
            boxShadow="0px 0px 100px 100px blue"
            rounded="full"
          />
        </motion.div>
        {insights.map((item) => (
          <InsightItem
            isIntersecting={isIntersecting}
            suffix={item.suffix}
            prefix={item.prefix}
            iconSrc={item.iconsSrc}
            count={item.count}
            title={item.title}
            key={item.id}
          />
        ))}
      </Stack>
    </VStack>
  );
};
