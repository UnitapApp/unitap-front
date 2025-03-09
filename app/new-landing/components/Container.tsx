import { PropsWithChildren } from "react";
import { Container as ChakraContainer, ContainerProps } from "@chakra-ui/react";
export const Container = ({
  children,
  ...restStyle
}: PropsWithChildren & ContainerProps) => {
  return (
    <ChakraContainer
      maxW="1440px"
      px={{ base: "16px", md: "29px",lg:"103px" }}
      {...restStyle}
    >
      {children}
    </ChakraContainer>
  );
};
