import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import AvatarDropdown from "components/global/header-avatar-dropdown";
import UserPosts from "components/me/bai-viet/bai-viet";
import { CommonSEO } from "components/seo";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { mainAPI } from "utils/axios";
import { getPostPath, getSocialImage } from "utils/utils";

export default function UserProfile() {
  const userState = useUserState();

  const router = useRouter();

  if (!userState.isLoggedIn) return null;

  const pageTitle = userState.metadata.full_name + " - Trang cá nhân";

  return (
    <>
      <CommonSEO title={pageTitle} />
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mx="auto"
        px={{ base: "16px", sm: 0 }}
        w="full"
        maxW="container.sm"
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
          {userState.isLoggedIn && <AvatarDropdown />}
        </Flex>
      </Flex>
      <hr />
      <Flex
        maxW="container.sm"
        mx={{ base: "4", sm: "auto" }}
        flexDirection="column"
        columnGap="4"
        rowGap={{ base: "4", sm: "8" }}
        py={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
      >
        <Flex justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            Chủ đề của bạn
          </Text>
          <Button onClick={() => router.push("/viet-bai")}>Tạo chủ đề</Button>
        </Flex>
        <Tabs colorScheme="black">
          <TabList gap="6">
            <Tab px="0">Nháp</Tab>
            <Tab px="0">Công khai</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px="0">
              <UserPosts status={"draft"} />
            </TabPanel>
            <TabPanel px="0">
              <UserPosts status={"public"} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
}
