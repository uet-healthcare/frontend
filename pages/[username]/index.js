import {
  Box,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { CommonSEO } from "components/seo";
import UserPublicPosts from "components/username/bai-viet";
import UserPublicAboutMe from "components/username/ve-toi";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";
import { useState } from "react";
import { mainAPI } from "utils/axios";
import { getSocialImage } from "utils/utils";

export default function UserProfile({ userMetadata, posts }) {
  const [currentTab, setCurrentTab] = useState(0);
  const userState = useUserState();

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

  return (
    <>
      <CommonSEO
        title={pageTitle}
        description={pageDescription}
        ogType={ogType}
        ogImage={socialImage}
        others={otherMetas}
      />
      <Flex alignItems="start">
        <Flex
          position="sticky"
          top="0"
          alignItems="flex-start"
          justifyContent={{ base: "center", "2xl": "flex-end" }}
          borderRight="1px"
          borderRightColor="gray.200"
          pt="8"
          pr={{ "2xl": "8" }}
          minW={{ base: "79px", "2xl": "15%" }}
          display={{ base: "none", lg: "flex" }}
          minH="100vh"
        >
          <Link href="/">
            <a>
              <Flex
                alignSelf="flex-start"
                justifyContent="center"
                alignItems="center"
                w="9"
                h="9"
                fontSize="3xl"
                borderRadius="base"
                backgroundColor="black"
                fontFamily="heading"
                color="white"
                fontWeight="bold"
              >
                V
              </Flex>
            </a>
          </Link>
        </Flex>
        <Flex
          flexDirection={{ base: "column", lg: "row" }}
          flexGrow="1"
          justifyContent="center"
          alignItems={{ base: "center", lg: "start" }}
        >
          <Flex
            alignItems="baseline"
            justifyContent="space-between"
            w="full"
            minW={{ md: "container.sm" }}
            maxW={{ md: "container.sm" }}
            mx="8"
            px={{ base: "4", sm: "8", md: "0" }}
            display={{ base: "flex", lg: "none" }}
          >
            <Link href="/">
              <a>
                <Box py="3" fontSize="xl" fontWeight="bold">
                  <Box as="span" color="gray.700">
                    Healthcare
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
            </Flex>
          </Flex>
          <Box
            bg="gray.300"
            h="1px"
            w="full"
            display={{ base: "block", lg: "none" }}
          />
          <Flex
            w="full"
            minW={{ md: "container.sm" }}
            maxW={{ md: "container.sm" }}
            mx="8"
            px={{ base: "4", sm: "8", md: "0" }}
            flexDirection="column"
            columnGap="4"
            rowGap={{ base: "4", sm: "8" }}
            lineHeight="tall"
            color="gray.900"
            fontSize={{ sm: "lg" }}
            pt="8"
          >
            <Flex flexDirection="column" gap="2">
              <Flex
                alignItems="center"
                justifyContent="center"
                flexShrink="0"
                w="24"
                h="24"
                borderRadius="full"
                backgroundColor="gray.100"
                color="gray.400"
                fontSize="4xl"
                fontWeight="semibold"
                display={{ base: "flex", lg: "none" }}
              >
                {userMetadata.avatar_url ? (
                  // eslint-disable-next-line
                  <Image
                    flexShrink={0}
                    src={userMetadata.avatar_url}
                    w="24"
                    h="24"
                    borderRadius="full"
                    referrerPolicy="no-referrer"
                    alt={userMetadata?.full_name + "'s avatar"}
                  />
                ) : (
                  userMetadata.full_name?.[0]
                )}
              </Flex>
              <Text fontSize="4xl" fontWeight="bold" fontFamily="heading">
                {userMetadata.full_name}
              </Text>
              {currentTab === 0 && userMetadata.bio && (
                <Text
                  fontSize="md"
                  textColor="gray.600"
                  display={{ base: "block", lg: "none" }}
                >
                  {userMetadata.bio}
                </Text>
              )}
            </Flex>
            <Tabs
              colorScheme="black"
              onChange={(index) => setCurrentTab(index)}
            >
              <TabList gap="6">
                <Tab px="0" id="chung">
                  Bài viết
                </Tab>
                {userMetadata.about && (
                  <Tab px="0" id="ve-toi">
                    Về tôi
                  </Tab>
                )}
              </TabList>
              <TabPanels>
                <TabPanel px="0">
                  <UserPublicPosts posts={posts} />
                </TabPanel>
                <TabPanel px="0">
                  <UserPublicAboutMe userMetadata={userMetadata} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Flex>
        <Flex
          position="sticky"
          top="0"
          alignItems="flex-start"
          borderLeft="1px"
          borderLeftColor="gray.200"
          w="full"
          maxW="30%"
          pb="4"
          pt="8"
          display={{ base: "none", lg: "flex" }}
          minH="100vh"
        >
          <Flex
            flexDirection="column"
            gap="4"
            w="full"
            px={{ base: "16px", sm: "10" }}
            maxW="96"
            flexShrink="0"
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
              w="24"
              h="24"
              borderRadius="full"
              backgroundColor="gray.100"
              color="gray.400"
              fontSize="5xl"
              fontWeight="semibold"
            >
              {userMetadata.avatar_url ? (
                // eslint-disable-next-line
                <Image
                  flexShrink={0}
                  src={userMetadata.avatar_url}
                  w="24"
                  h="24"
                  borderRadius="full"
                  referrerPolicy="no-referrer"
                  alt={userMetadata?.full_name + "'s avatar"}
                />
              ) : (
                userMetadata.full_name?.[0]
              )}
            </Flex>

            <Text fontWeight="semibold" fontFamily="heading" fontSize="lg">
              {userMetadata.full_name}
            </Text>
            <Flex textColor="gray.700">{userMetadata.bio}</Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;
  const {
    data: { data: userMetadata },
  } = await mainAPI.get(`/public/users/metadata?username=${username}`);

  const {
    data: { data: posts },
  } = await mainAPI.get(`/public/posts?username=${username}`);

  return {
    props: {
      userMetadata: userMetadata || null,
      posts: posts
        ? posts.map((el) => ({
            ...el,
            created_at: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(el.created_at)),
          }))
        : null,
    },
  };
}
