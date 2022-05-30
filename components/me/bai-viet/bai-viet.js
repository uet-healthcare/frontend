import { Divider, Flex, VStack } from "@chakra-ui/react";
import { CommonSEO } from "components/seo";
import { useUserState } from "hooks/use-user-state";
import { Fragment, useEffect, useState } from "react";
import { mainAPI } from "utils/axios";
import { UserDraftPosts } from "./draft";
import { UserPublicPosts } from "./public";

export default function UserPosts({ status: postStatus }) {
  const userState = useUserState();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    if (!userState.isLoggedIn) return;

    const fetchData = async () => {
      const { data: responseData } = await mainAPI.get(
        `/private/posts?username=${userState.metadata.username}&status=${postStatus}`
      );
      setPosts(responseData.data);
    };
    fetchData();
  }, [userState, postStatus]);

  if (!userState.isLoggedIn) return null;

  const pageTitle = userState.metadata.full_name + " - Trang cá nhân";

  return (
    <>
      <CommonSEO title={pageTitle} />

      <Flex
        maxW="container.sm"
        mx={{ base: "4", sm: "auto" }}
        flexDirection="column"
        columnGap="4"
        rowGap={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
      >
        <VStack divider={<Divider />} mt={{ sm: "3" }}>
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Fragment key={post.post_id}>
                {postStatus === "draft" && <UserDraftPosts post={post} />}
                {postStatus === "public" && <UserPublicPosts post={post} />}
              </Fragment>
            ))
          ) : (
            <Flex>Bạn chưa có chủ đề nào</Flex>
          )}
        </VStack>
      </Flex>
    </>
  );
}
