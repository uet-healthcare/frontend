import { Box, Divider, Flex, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { Fragment } from "react";
import { getPostPath } from "utils/utils";

export default function UserPublicPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return "Chưa có bài viết nào.";
  }

  return (
    <VStack divider={<Divider />}>
      {posts &&
        posts.map((post) => (
          <Fragment key={post.post_id}>
            <VStack alignItems="left" gap="1" py="5" w="full">
              <Box
                as="span"
                fontSize="xl"
                fontWeight="bold"
                color="gray.800"
                fontFamily="heading"
              >
                <Link
                  href={getPostPath(
                    post.post_id,
                    post.author.username,
                    post.title
                  )}
                >
                  <a>
                    <Box
                      as="span"
                      _hover={{ textDecoration: "underline" }}
                      fontSize={{ base: "xl", sm: "2xl" }}
                    >
                      {post.title}
                    </Box>
                  </a>
                </Link>
              </Box>
              <div>{post.content}...</div>
              <Flex spacing="4" alignItems="center">
                <Flex
                  flexWrap="wrap"
                  alignItems="center"
                  gap="2.5"
                  fontSize="sm"
                  color="gray.600"
                >
                  <Link href={`/${post.author.username}`}>
                    <a>
                      <Box _hover={{ textDecoration: "underline" }}>
                        {post.author.full_name}
                      </Box>
                    </a>
                  </Link>
                  <div>&#183;</div>
                  <div>{post.created_at}</div>
                </Flex>
              </Flex>
            </VStack>
          </Fragment>
        ))}
    </VStack>
  );
}
