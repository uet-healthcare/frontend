import { Box, Divider, Flex, Image, Text, VStack } from "@chakra-ui/react";
import AvatarDropdown from "components/global/header-avatar-dropdown";
import { CommonSEO } from "components/seo";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";

import { Fragment, useEffect, useState } from "react";
import { mainAPI } from "utils/axios";
import { getPostPath, getSocialImage } from "utils/utils";

const POSTS_PER_PAGE = 10;

export default function Home({ posts: initialPosts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const userState = useUserState();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        setIsLoading(true);
      }
    };
    window.addEventListener("scroll", handleScroll, false);

    return () => {
      window.removeEventListener("scroll", handleScroll, false);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    mainAPI
      .get(`/public/posts?offset=${posts.length}&limit=${POSTS_PER_PAGE}`)
      .then((response) => {
        if (response.status === 200 && response.data) {
          const responsePosts = response.data.map((post) => ({
            ...post,
            created_at: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(post.created_at)),
          }));
          if (response.data.length) {
            setPosts((prevState) => [...prevState, ...responsePosts]);
          }
        }
      })
      .catch((error) => console.error(error))
      .then(() => {
        setIsLoading(false);
      });
  }, [posts, isLoading]);

  return (
    <>
      <CommonSEO
        title={"Vietlach"}
        description="Chia sẻ góc nhìn về mọi thứ trong cuộc sống quanh bạn."
        ogType="website"
        ogImage={getSocialImage()}
      />
      <Flex
        alignItems="baseline"
        justifyContent="space-between"
        mx="auto"
        px={{ base: "4", sm: "8", md: "0" }}
        w="full"
        maxW="container.sm"
      >
        <Link href="/">
          <a>
            <Box py="3" fontSize="xl" fontWeight="bold">
              <Box as="span" color="gray.700">
                vietlach
              </Box>
              <Box as="span" color="red.400">
                .vn
              </Box>
            </Box>
          </a>
        </Link>
        <Flex alignItems="center" gap="3" fontSize="sm" color="gray.600">
          <Link href={userState.isLoggedIn ? "/me/bai-viet" : "/dang-nhap"}>
            <a>
              <Box _hover={{ color: "gray.900" }}>
                {userState.isLoggedIn ? "Viết bài" : "Đăng nhập"}
              </Box>
            </a>
          </Link>
          {userState.isLoggedIn && <AvatarDropdown />}
        </Flex>
      </Flex>
      <hr />
      <Flex
        maxW="container.sm"
        mx="auto"
        px={{ base: "4", sm: "8", md: "0" }}
        flexDirection="column"
        columnGap="4"
        rowGap={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
      >
        <VStack divider={<Divider />} mt={{ base: "4", sm: "8" }}>
          {posts && posts.length > 0 ? (
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
                          <Flex alignItems="center" gap="2.5" role="group">
                            <Flex alignItems="center" gap="2.5">
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                flexShrink="0"
                                w="8"
                                h="8"
                                borderRadius="lg"
                                backgroundColor="red.50"
                                color="red.800"
                              >
                                {post.author.avatar_url ? (
                                  // eslint-disable-next-line
                                  <Image
                                    src={post.author.avatar_url}
                                    w="8"
                                    h="8"
                                    borderRadius="lg"
                                    referrerPolicy="no-referrer"
                                    alt={post.author.full_name + "'s avatar"}
                                  />
                                ) : (
                                  post.author.full_name?.[0]
                                )}
                              </Flex>
                              <Box
                                _groupHover={{ textDecoration: "underline" }}
                              >
                                {post.author.full_name}
                              </Box>
                            </Flex>
                          </Flex>
                        </a>
                      </Link>
                      <div>&#183;</div>
                      <div>{post.created_at}</div>
                    </Flex>
                  </Flex>
                </VStack>
              </Fragment>
            ))
          ) : (
            <Text py="8">Chưa có bài viết nào.</Text>
          )}
        </VStack>
      </Flex>
    </>
  );
}

export async function getServerSideProps() {
  const limit = 10;
  const response = await mainAPI.get(`/public/posts?limit=${limit}`);
  const responseData = response.data;
  return {
    props: {
      posts:
        response.status === 200 && responseData?.success
          ? responseData.data.map((el) => ({
              ...el,
              created_at: Intl.DateTimeFormat("vi-VN", {
                dateStyle: "long",
              }).format(new Date(el.created_at)),
            }))
          : null,
    },
  };
}
