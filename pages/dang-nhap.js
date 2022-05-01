import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { GoogleLoginButton } from "components/google-login-button";
import Link from "next/link";
import { useState } from "react";
import { auth } from "utils/auth";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    auth
      .login(username, password, true)
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        alert(error);
      });
  };

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
        <Flex
          alignItems="center"
          gap="2"
          fontSize="sm"
          color="gray.500"
          _hover={{ color: "gray.700" }}
        >
          <Link href="/dang-ky">
            <a>Đăng ký</a>
          </Link>
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
        <Flex
          flexDirection="column"
          alignItems="center"
          gap="4"
          mt="8"
          mx={{ base: "auto", sm: "32" }}
        >
          <GoogleLoginButton>Đăng nhập với Google</GoogleLoginButton>
          <Box fontSize="sm" color="gray.500">
            hoặc
          </Box>
          <Flex
            as="form"
            flexDirection="column"
            gap="3"
            w="full"
            onSubmit={handleLogin}
          >
            <Input
              placeholder="Email của bạn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="************"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button>Đăng nhập</Button>
          </Flex>
          <Box fontSize="sm" color="gray.500">
            Bạn chưa có tài khoản?{" "}
            <Link href="/dang-ky">
              <a>
                <Box as="span" textDecoration="underline">
                  Đăng ký ngay
                </Box>
              </a>
            </Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
