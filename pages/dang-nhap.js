import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { GoogleLoginButton } from "components/google-login-button";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth } from "utils/auth";
import { signInSchema } from "utils/schemas";

export default function SignIn() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signInSchema) });

  const onSubmit = (user) => {
    setIsLoading(true);
    auth
      .login(user.email, user.password, true)
      .then(() => {
        window.open("/", "_self");
      })
      .catch((error) => {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng",
          status: "error",
          isClosable: true,
        });
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Flex
        alignItems="baseline"
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
        mx={{ base: "4", sm: "auto" }}
        flexDirection="column"
        columnGap="4"
        rowGap={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
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
            validationSche
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isInvalid={errors.email}>
              <Input placeholder="Email của bạn" {...register("email")} />
              {errors.email && (
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <Input
                placeholder="************"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit" isLoading={isLoading}>
              Đăng nhập
            </Button>
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
