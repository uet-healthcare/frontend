import { Box, Flex, VStack } from "@chakra-ui/react";
import Link from "next/link";

export function UserDraftPosts({ post }) {
  return (
    <VStack alignItems="left" gap="1" py="5" w="full">
      <Box
        as="span"
        fontSize="xl"
        fontWeight="bold"
        color="gray.800"
        fontFamily="heading"
      >
        <Link href={`/viet-bai?id=${post.post_id}`}>
          <a>
            <Box as="span" _hover={{ textDecoration: "underline" }}>
              {post.title || "Không có tiêu đề"}
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
          <div>
            Sửa lần cuối{" "}
            {Intl.DateTimeFormat("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(post.updated_at))}
          </div>
        </Flex>
      </Flex>
    </VStack>
  );
}
