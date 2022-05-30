import {
  Box,
  Divider,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import AvatarDropdown from "components/global/header-avatar-dropdown";
import { CommonSEO } from "components/seo";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";

import { Fragment, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { mainAPI } from "utils/axios";
import { getPostPath, getSocialImage } from "utils/utils";

const POSTS_PER_PAGE = 10;

export default function Home({ posts: initialPosts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("");
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

  const filteredPosts =
    posts && posts.length > 0
      ? posts.filter((post) => post.title.includes(filter))
      : [];

  return (
    <>
      <CommonSEO
        title={"Healthcare"}
        description="Chia sẻ góc nhìn về mọi thứ trong cuộc sống quanh bạn."
        ogType="website"
        ogImage={getSocialImage()}
      />
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mx="auto"
        px={{ base: "4", sm: "8", md: "0" }}
        w="full"
        maxW="container.lg"
      >
        <Link href="/">
          <a>
            <Box py="3" fontSize="3xl" fontWeight="bold">
              <Box as="span" fontFamily="heading">
                Healthcare
              </Box>
            </Box>
          </a>
        </Link>
        <Flex alignItems="center" gap="3" color="gray.600">
          <Link href={userState.isLoggedIn ? "/viet-bai" : "/dang-nhap"}>
            <a>
              <Box _hover={{ color: "gray.900" }}>
                {userState.isLoggedIn ? "Đặt câu hỏi" : "Đăng nhập"}
              </Box>
            </a>
          </Link>
          {userState.isLoggedIn && <AvatarDropdown />}
        </Flex>
      </Flex>
      <hr borderColor="white" />

      <Flex
        maxW="container.lg"
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
          <Box w="full" mb="4">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={BiSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </Box>
          <TableContainer w="full">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Câu hỏi</Th>
                  <Th>Đăng bởi</Th>
                  <Th>Ngày đăng</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Fragment key={post.post_id}>
                      <Tr>
                        <Td _hover={{ textDecoration: "underline" }}>
                          <Link
                            href={getPostPath(
                              post.post_id,
                              post.author.username,
                              post.title
                            )}
                          >
                            <a>{post.title}</a>
                          </Link>
                        </Td>
                        <Td _hover={{ textDecoration: "underline" }}>
                          <Link href={`/${post.author.username}`}>
                            <a>{post.author.full_name}</a>
                          </Link>
                        </Td>
                        <Td>{post.created_at}</Td>
                      </Tr>
                    </Fragment>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={3} textAlign="left">
                      Chưa có câu hỏi nào.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
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
                dateStyle: "short",
              }).format(new Date(el.created_at)),
            }))
          : null,
    },
  };
}
