import { SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { missions } from "../constants";

interface MissionProps {
  content: string;
  index: number;
}
export const MissionItem = ({ content, index }: MissionProps) => {
  return (
    <VStack
      boxShadow="4px 4px 0px var(--chakra-colors-gray-800)"
      border="1px solid"
      borderColor="gray.800"
      py="8px"
      justifyContent="center"
      borderRadius="8px"
      bg="gray.50"
      position="relative"
      height={{ base: "80px", md: "100px", lg: "80px" }}
    >
      <Text
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="32px"
        height="32px"
        rounded="full"
        position="absolute"
        top="-16px"
        left="-16px"
        boxShadow="2px 2px 0px 0px #000000"
        fontSize="16px"
        fontWeight="800"
        fontFamily="nunito"
      >
        #{index + 1}
      </Text>
      <Text
        fontSize="18px"
        textAlign="left"
        width="full"
        pl="28px"
        fontFamily="nunito"
      >
        {content}
      </Text>
    </VStack>
  );
};

export const Mission = () => (
  <VStack>
    <Text
      fontFamily="plusJakartaSans"
      fontSize={{ base: "48px", md: "74px" }}
      fontWeight="800"
      mb="24px"
    >
      Our mission
    </Text>
    <SimpleGrid px={{base:'8px',md:'0'}} gap="24px" columns={{ base: 1, md: 2 }}>
      {missions.map((mission, index) => (
        <MissionItem content={mission.text} index={index} key={mission.id} />
      ))}
    </SimpleGrid>
  </VStack>
);
