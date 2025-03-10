import {
  Avatar,
  Box,
  chakra,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { members } from "../constants";
import { motion } from "framer-motion";

interface MemberCardProps {
  role: string;
  name: string;
  id: string;
  img: string;
  description: string;
}
const MemberCard = ({ description, id, name, role }: MemberCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ display: "flex" }}
    >
      <VStack
        p="16px"
        borderRadius="6px"
        boxShadow="4px 6px 0px black"
        bg="white"
        border="1px solid black"
        width="350px"
        position="relative"
        alignItems="flex-start"
      >
        <Box
          px="6px"
          py="3px"
          bg="white"
          border="1px solid black"
          boxShadow="2px 2px 0px black"
          position="absolute"
          top="-8px"
          left="-8px"
          transform="rotate(-12deg)"
        >
          <Text>{role}</Text>
        </Box>
        <HStack mt="8px">
          <Box
            border="1px solid black"
            rounded="full"
            boxShadow="4px 4px 0px black"
            boxSize="50px"
            position="relative"
          >
            <Avatar name={name} src="https://bit.ly/broken-link" />
          </Box>
          <VStack rowGap="0" alignItems="flex-start">
            <Text fontSize="18px" fontFamily="kodchasan">
              {name}
            </Text>
            <Text fontSize="14px" fontFamily="nunito">
              {id}
            </Text>
          </VStack>
        </HStack>
        <Text fontSize="16px" fontFamily="nunito" lineHeight="24px">
          {description}
        </Text>
      </VStack>
    </motion.div>
  );
};

export const Team = () => {
  return (
    <VStack pb="30px" position="relative">
      <motion.div
        animate={{
          x: [250, 100, 400],
          y: [400, 800, 500],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
        initial={{ position: "absolute", x: -200, y: 250 }}
      >
        <Box
          zIndex={0}
          width="10px"
          height="10px"
          bg="green"
          opacity={0.3}
          boxShadow="0px 0px 100px 100px green"
          rounded="full"
          position="absolute"
          top="50%"
          left="0"
        />
      </motion.div>
      <motion.div
        animate={{
          x: [-300, -400, 400],
          y: [200, 400, -80],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
        initial={{ position: "absolute", x: -200, y: 250 }}
      >
        <Box
          zIndex={0}
          width="10px"
          height="10px"
          bg="purple"
          opacity={0.3}
          boxShadow="0px 0px 100px 100px purple"
          rounded="full"
          position="absolute"
          top="28%"
          right="40%"
        />
      </motion.div>
      <chakra.span
        mb="34px"
        textAlign="center"
        fontFamily="plusJakartaSans"
        color="black"
        fontSize={{ base: "24px", md: "34px" }}
        fontWeight="400"
        lineHeight={{ base: "26px", md: "37px" }}
        bgColor="white"
        bgImage="url('/home/features/dot-pattern.png')"
        p="12px"
        borderRadius="8px"
        boxShadow="4px 4px 0px black"
        border="1px solid black"
      >
        <Heading
          fontSize={{ base: "48px", md: "74px" }}
          lineHeight={{ base: "52px", md: "80px" }}
          fontWeight="800"
        >
          TEAM{" "}
          <chakra.span color="white" bg="black">
            MEMBERS
          </chakra.span>
        </Heading>
      </chakra.span>
      <HStack
        alignItems="stretch"
        gap="36px"
        justifyContent="center"
        flexWrap="wrap"
      >
        {members.map((item) => (
          <MemberCard key={item.id} {...item} />
        ))}
      </HStack>
    </VStack>
  );
};
