import { Button, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";

export const BackButton = ({ children, ...props }) => {
  const router = useRouter();
  const [backToPage, setBackToPage] = useState("/");

  useEffect(() => {
    const requestedPath = window.localStorage.getItem("_vlcfp");
    if (!requestedPath) return;

    if (requestedPath) {
      setBackToPage(requestedPath);
    }
  }, []);

  return (
    <Button
      variant="ghost"
      colorScheme="gray"
      fontSize="xl"
      onClick={() => router.push(backToPage)}
      p="0"
    >
      {children ? (
        children
      ) : (
        <Icon as={BiLeftArrowAlt} w="6" h="6" {...props} />
      )}
    </Button>
  );
};
