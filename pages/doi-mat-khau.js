import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { GoogleLoginButton } from "components/google-login-button";
import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "utils/auth";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  const handleUpdate = (event) => {
    event.preventDefault();

    auth
      .currentUser()
      .update({ password: newPassword })
      .then((user) => {
        alert("Cập nhật thông tin thành công!");
        console.log("Updated user %s", user);
      })
      .catch((error) => {
        alert("Đã có lỗi xảy ra, vui lòng thử lại.");
        console.log("Failed to update user: %o", error);
        throw error;
      });
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={{ base: "16px", md: 0 }}
        w="full"
        maxW="container.sm"
        mx="auto"
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
        <AvatarDropdown />
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
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="4"
          mt="12"
          mx={{ base: "auto", sm: "32" }}
        >
          <Flex
            as="form"
            flexDirection="column"
            gap="3"
            w="full"
            onSubmit={handleUpdate}
          >
            <Flex flexDirection="column" gap="3">
              <Input
                placeholder="Mật khẩu cũ"
                value={currentPassword}
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                placeholder="Mật khẩu mới"
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                placeholder="Xác nhận mật khẩu mới"
                value={newPasswordAgain}
                type="password"
                pattern={newPassword}
                onChange={(e) => setNewPasswordAgain(e.target.value)}
              />
            </Flex>
            <Button>Cập nhật</Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
