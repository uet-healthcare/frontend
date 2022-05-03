import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiLeftArrowAlt } from "react-icons/bi";

export const BackButton = ({ children }) => {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      colorScheme="gray"
      fontSize="xl"
      onClick={() => {
        if (window.history.length > 2) router.back();
        else router.push("/");
      }}
      p="0"
    >
      {children ? children : <Icon as={BiLeftArrowAlt} w="6" h="6" />}
    </Button>
  );
};
