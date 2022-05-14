import { Box, Divider, Flex, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { getPostPath } from "utils/utils";

export default function UserPublicPosts({ posts }) {
  const router = useRouter();

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
                  <a
                    onClick={() =>
                      window.localStorage.setItem("_vlcfp", router.asPath)
                    }
                  >
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
              <div>
                {post.content
                  .trim()
                  .split("\n")
                  .filter((el) => !el.includes("http"))
                  .join("\n")}
                ...
              </div>
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
