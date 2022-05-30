import { Button, Flex, useToast } from "@chakra-ui/react";
import { useUserState } from "hooks/use-user-state";
import { useEffect, useState } from "react";
import { getSocialImage, reduceContent } from "utils/utils";
import { CommonSEO } from "components/seo";
import Editor from "components/editor";
import { mainAPI } from "utils/axios";

export default function UpdateAboutMe() {
  const toast = useToast();
  const userState = useUserState();

  const [defaultContent, setDefaultContent] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    if (!userState.isLoggedIn) return;
    setDefaultContent(userState.metadata.about);
    setAboutMe(userState.metadata.about);
  }, [userState]);

  const handleUpdate = () => {
    mainAPI
      .put(`/private/users/metadata`, {
        about: aboutMe,
      })
      .then((response) => {
        const responseData = response.data;
        if (response.status === 200 && responseData.success) {
          toast({
            title: "Cập nhật thành công!",
            status: "success",
            isClosable: true,
          });
          window.localStorage.removeItem("user_metadata");
          setTimeout(() => window.open("/", "_self"), 500);
        } else {
          throw new Error(responseData.error.message);
        }
      })
      .catch((error) => {
        toast({
          title: "Cập nhật thất bại",
          description: error.message,
          status: "error",
          isClosable: true,
        });
        console.error(error);
      });
  };

  return (
    <>
      <CommonSEO
        title="Cập nhật thông tin tài khoản - Healthcare"
        ogImage={getSocialImage()}
        noIndex={true}
      />
      <Flex
        maxW="container.sm"
        mx={{ base: "4", sm: "auto" }}
        mt="4"
        flexDirection="column"
        gap="4"
        rowGap={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
      >
        <Editor
          placeholder={"Giới thiệu bản thân bạn..."}
          defaultValue={defaultContent}
          onChange={async (value) => {
            setAboutMe(reduceContent(value));
          }}
        />
        <Button type="button" mt="4" onClick={handleUpdate} isFullWidth>
          Cập nhật
        </Button>
      </Flex>
    </>
  );
}
