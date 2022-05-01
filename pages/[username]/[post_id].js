import PostBody from "components/post-body";
import { useRouter } from "next/router";
import { getPostIDFromPath } from "utils/utils";
import { mainAPI } from "utils/axios";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { Box, Button, Flex, Image } from "@chakra-ui/react";

export default function PostDetail({ post }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.username !== post.author.username) {
      router.replace(`/${post.author.username}/${router.query.post_id}`);
    }
  }, [router, post]);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Flex
        flexDirection="column"
        maxW="container.sm"
        pt="8"
        pb="16"
        mx={{ base: "4", md: "auto" }}
        fontSize={{ md: "lg" }}
        gap={{ base: "4", md: "6" }}
        lineHeight="tall"
        color="gray.900"
      >
        <Flex
          alignItems="center"
          gap="1"
          color="gray.400"
          className="flex items-center gap-16 text-gray-400"
        >
          <Button variant="ghost" fontSize="xl" onClick={() => router.back()}>
            &larr;
          </Button>
          <Link href="/">
            <a>
              <Box as="span" fontWeight="bold" _hover={{ color: "gray.600" }}>
                vietlach.vn
              </Box>
            </a>
          </Link>
        </Flex>
        <Box
          as="h1"
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="bold"
          color="gray.800"
          fontFamily="heading"
          lineHeight="short"
        >
          {post.title}
        </Box>
        <Flex alignItems="center" gap="4">
          <Flex
            flexWrap="wrap"
            alignItems="center"
            gap={{ base: "5", sm: "2.5" }}
            rowGap="2"
            fontSize="sm"
            color="gray.600"
          >
            <Link href={`/${post.author.username}`}>
              <a>
                <Flex role="group" alignItems="center" gap="2.5">
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
                    {post?.author?.avatar_url ? (
                      // eslint-disable-next-line
                      <Image
                        src={post?.author?.avatar_url}
                        w="8"
                        h="8"
                        borderRadius="lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : post?.author?.full_name ? (
                      [0]
                    ) : (
                      ""
                    )}
                  </Flex>
                  <Box _groupHover={{ textDecoration: "underline" }}>
                    {post?.author?.full_name}
                  </Box>
                </Flex>
              </a>
            </Link>
            <div>&#183;</div>
            <div>{post.created_time}</div>
          </Flex>
        </Flex>
        <PostBody>{post.content}</PostBody>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context) {
  const postID = getPostIDFromPath(context.query.post_id);
  const response = await mainAPI.get(`/public/posts?id=${postID}`);
  const [post] = response.data;

  return {
    props: {
      post: post
        ? {
            ...post,
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
            }).format(new Date(post.created_time)),
          }
        : null,
    },
  };
}
