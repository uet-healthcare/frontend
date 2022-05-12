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
import UpdateGeneralInfo from "components/me/thong-tin/chung";
import UpdateAboutMe from "components/me/thong-tin/ve-toi";
import { CommonSEO } from "components/seo";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserProfile() {
  const userState = useUserState();

  const router = useRouter();

  if (!userState.isLoggedIn) return null;

  const pageTitle = userState.metadata.full_name + " - Trang cá nhân";

  return (
    <>
      <CommonSEO title={pageTitle} />
      <Box h="100vh" position="relative">
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
                  vietlach
                </Box>
                <Box as="span" color="red.400">
                  .vn
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
              Cập nhật thông tin
            </Text>
          </Flex>
          <Tabs colorScheme="black">
            <TabList gap="6">
              <Tab px="0" id="chung">
                Chung
              </Tab>
              <Tab px="0" id="ve-toi">
                Về tôi
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px="0">
                <UpdateGeneralInfo />
              </TabPanel>
              <TabPanel px="0">
                <UpdateAboutMe />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </>
  );
}
