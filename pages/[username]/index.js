import { Box, Divider, Flex, Image, VStack } from "@chakra-ui/react";
import { CommonSEO } from "components/seo";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { mainAPI } from "utils/axios";
import { getPostPath, getSocialImage } from "utils/utils";

export default function UserProfile({ userMetadata, posts }) {
  const pageTitle = userMetadata.full_name + " - Trang cá nhân";
  const pageDescription = "";
  const ogType = "profile";

  const socialImage = getSocialImage({
    path: userMetadata.username,
    subtitle: "Trang cá nhân",
    title: userMetadata.full_name,
  });

  const otherMetas = [
    { name: "profile:full_name", content: userMetadata.full_name },
    { name: "profile:username", content: userMetadata.username },
  ];

  console.log(socialImage);
  return (
    <>
      <CommonSEO
        title={pageTitle}
        description={pageDescription}
        ogType={ogType}
        ogImage={socialImage}
        others={otherMetas}
      />
      <Flex
        alignItems="baseline"
        justifyContent="space-between"
        mx="auto"
        px={{ base: "16px", sm: 0 }}
        w="full"
        maxW="container.sm"
      >
        <Flex
          flexWrap="wrap"
          alignItems="center"
          gap={{ base: "2.5", sm: "4" }}
          py="4"
        >
          <Link href={`/${userMetadata.username}`}>
            <a>
              <Flex alignItems="center" gap="2">
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                  width="8"
                  height="8"
                  mr="1"
                  borderRadius="lg"
                  backgroundColor="red.50"
                  color="red.800"
                >
                  {userMetadata.avatar_url ? (
                    <Image
                      src={userMetadata.avatar_url}
                      w="8"
                      h="8"
                      borderRadius="lg"
                      referrerPolicy="no-referrer"
                      alt={userMetadata?.full_name + "'s avatar"}
                    />
                  ) : (
                    userMetadata.full_name?.[0]
                  )}
                </Flex>
                <Box
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontWeight="bold"
                  color="gray.700"
                >
                  {userMetadata.full_name}
                </Box>
              </Flex>
            </a>
          </Link>

          <Box color="gray.400">|</Box>
          <Link href="/">
            <a>
              <Box color="gray.400" _hover={{ textDecoration: "underline" }}>
                vietlach.vn
              </Box>
            </a>
          </Link>
        </Flex>
      </Flex>
      <hr />
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
                        <Box as="span" _hover={{ textDecoration: "underline" }}>
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
                      <div>{post.created_time}</div>
                    </Flex>
                  </Flex>
                </VStack>
              </Fragment>
            ))}
        </VStack>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const { data: userMetadata } = await mainAPI.get(
    `/public/users/metadata?username=${username}`
  );

  const { data: posts } = await mainAPI.get(
    `/public/posts?username=${username}`
  );

  return {
    props: {
      userMetadata: userMetadata || null,
      posts: posts
        ? posts.map((el) => ({
            ...el,
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(el.created_time)),
          }))
        : null,
    },
  };
}
