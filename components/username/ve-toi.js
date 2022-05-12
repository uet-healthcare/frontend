import { Flex } from "@chakra-ui/react";
import PostBody from "components/post-body";

export default function UserPublicAboutMe({ userMetadata }) {
  return (
    <Flex flexDirection="column" gap={{ base: "4", sm: "6" }} pt="6">
      <PostBody>{userMetadata.about}</PostBody>
    </Flex>
  );
}
