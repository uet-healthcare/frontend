import { Box, Divider, Flex, Image, VStack } from "@chakra-ui/react";
import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";

import { Fragment, useEffect, useState } from "react";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import { getPostPath } from "utils/utils";

const POSTS_PER_PAGE = 10;

export default function Home({ posts: initialPosts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(auth.currentUser()));

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
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(post.created_time)),
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
      <Flex
        alignItems="baseline"
        justifyContent="space-between"
        mx="auto"
        px={{ base: "16px", md: 0 }}
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
          <Link href={isLoggedIn ? "/viet-bai" : "/dang-nhap"}>
            <a>
              <Box _hover={{ color: "gray.900" }}>
                {isLoggedIn ? "Viết bài" : "Đăng nhập"}
              </Box>
            </a>
          </Link>
          {isLoggedIn && <AvatarDropdown />}
        </Flex>
      </Flex>
      <hr />
      <Flex
        maxW="container.sm"
        mx={{ base: "4", md: "auto" }}
        flexDirection="column"
        columnGap="4"
        rowGap={{ base: "4", md: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ md: "lg" }}
      >
        <VStack divider={<Divider />} mt={{ md: "3" }}>
          {posts &&
            posts.map((post) => (
              <Fragment key={post.post_id}>
                <VStack alignItems="left" gap="1" py="5">
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

export async function getServerSideProps() {
  const limit = 10;
  const { data: posts } = await mainAPI.get(`/public/posts?limit=${limit}`);

  return {
    props: {
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
