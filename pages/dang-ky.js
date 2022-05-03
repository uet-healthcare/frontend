import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleLoginButton } from "components/google-login-button";
import { CommonSEO } from "components/seo";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "utils/auth";
import { signInSchema } from "utils/schemas";
import { getSocialImage } from "utils/utils";

export default function SignUps() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (user) => {
    setIsLoading(true);
    auth
      .signup(user.email, user.password)
      .then(() => {
        auth
          .login(user.email, user.password, true)
          .then(() => {
            window.open("/cap-nhat-thong-tin", "_self");
          })
          .catch((error) => {
            toast({
              title: "Đăng nhập thất bại",
              description: error?.message,
              status: "error",
              isClosable: true,
            });
          });
      })
      .catch((error) => {
        toast({
          title: "Đăng ký thất bại",
          description: error?.mesage,
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <CommonSEO
        title="Đăng ký tài khoản Vietlach"
        ogType="website"
        ogImage={getSocialImage()}
      />
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
          <Link href="/dang-nhap">
            <a>Đăng nhập</a>
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
          <GoogleLoginButton>Đăng ký với google</GoogleLoginButton>
          <Box fontSize="sm" color="gray.500">
            hoặc
          </Box>
          <Flex
            as="form"
            flexDirection="column"
            gap="3"
            w="full"
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
              Đăng ký
            </Button>
          </Flex>
          <Box fontSize="sm" color="gray.500">
            Bạn đã có tài khoản?{" "}
            <Link href="/dang-nhap">
              <a>
                <Box as="span" textDecoration="underline">
                  Đăng nhập ngay
                </Box>
              </a>
            </Link>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
