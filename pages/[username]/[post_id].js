import PostBody from "components/post-body";
import { useRouter } from "next/router";
import { getPostIDFromPath, getSocialImage } from "utils/utils";
import { mainAPI } from "utils/axios";
import Link from "next/link";
import { useEffect } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { BackButton } from "components/back-button";
import { CommonSEO } from "components/seo";
import PostAction from "components/post/post-action";

export default function PostDetail({ post }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.username !== post.author.username) {
      router.replace(`/${post.author.username}/${router.query.post_id}`);
    }
  }, [router, post]);

  const pageTitle = post.title + " - Vietlach";
  const pageDescription =
    (post.content
      .split("\n")
      .filter(
        (line) =>
          !line.startsWith("# ") && !line.startsWith("\n") && line.length >= 5
      )
      .slice(0, 3)
      .join(" ")
      .substr(0, 157) ||
      post.content.split("\n").slice(0, 3).join(" ").substr(0, 157)) + "...";

  const socialImage = getSocialImage({
    path: post.author.username,
    subtitle: post.author.full_name,
    title: post.title,
  });

  return (
    <>
      <CommonSEO
        title={pageTitle}
        description={pageDescription}
        ogType="article"
        ogImage={socialImage}
      />
      <Flex
        justifyContent="center"
        px="4"
        pt={{ base: "2", sm: "8" }}
        pb={{ base: "4", sm: "10" }}
      >
        <Flex
          flexDirection="column"
          w="full"
          maxW="container.sm"
          fontSize={{ sm: "lg" }}
          lineHeight="tall"
          color="gray.900"
        >
          <Flex alignItems="center" justifyContent="space-between" mb="2">
            <Flex alignItems="center" gap="1" color="gray.400">
              <BackButton />
              <Link href="/">
                <a>
                  <Box
                    as="span"
                    fontWeight="bold"
                    _hover={{ color: "gray.600" }}
                  >
                    vietlach.vn
                  </Box>
                </a>
              </Link>
            </Flex>
            <PostAction post={post} />
          </Flex>
          <Box
            as="h1"
            fontSize={{ base: "2xl", sm: "4xl" }}
            fontWeight="bold"
            color="gray.800"
            fontFamily="heading"
            lineHeight="short"
            mb={{ base: "4", sm: "6" }}
          >
            {post.title}
          </Box>
          <Flex alignItems="center" gap="4" mb={{ base: "4", sm: "10" }}>
            <Flex
              flexDirection={{ base: "column-reverse", sm: "row" }}
              flexWrap="wrap"
              alignItems={{ base: "start", sm: "center" }}
              gap={{ base: "4", sm: "2.5" }}
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
                          alt={post?.author?.full_name + "'s avatar"}
                        />
                      ) : (
                        post?.author?.full_name?.[0]
                      )}
                    </Flex>
                    <Box _groupHover={{ textDecoration: "underline" }}>
                      {post?.author?.full_name}
                    </Box>
                  </Flex>
                </a>
              </Link>
              <Box display={{ base: "none", sm: "inline-block" }}>&#183;</Box>
              <div>{post.created_at}</div>
            </Flex>
          </Flex>
          <Flex flexDirection="column" gap={{ base: "4", sm: "6" }}>
            <PostBody>{post.content}</PostBody>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context) {
  const postID = getPostIDFromPath(context.query.post_id);
  const response = await mainAPI.get(`/public/posts?id=${postID}`);
  const [post] = response.data.data;

  return {
    props: {
      post: post
        ? {
            ...post,
            created_at: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
            }).format(new Date(post.created_at)),
          }
        : null,
    },
  };
}
