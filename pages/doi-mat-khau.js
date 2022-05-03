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
import AvatarDropdown from "components/global/header-avatar-dropdown";
import { CommonSEO } from "components/seo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { auth } from "utils/auth";
import { getSocialImage } from "utils/utils";
import * as yup from "yup";

const schema = yup.object().shape({
  newPassword: yup.string().min(5).required("Bạn chưa nhập mật khẩu"),
  newPasswordAgain: yup
    .string()
    .test("Password", "Mật khẩu nhập lại không khớp", (value, testContext) =>
      value ? value === testContext.parent.newPassword : true
    )
    .required("Bạn chưa nhập lại mật khẩu"),
});

export default function ChangePassword() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleUpdate = (data) => {
    auth
      .currentUser()
      .update({ password: data.newPassword })
      .then((user) => {
        toast({
          title: "Cập nhật thành công!",
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Cập nhật thất bại",
          status: "error",
          isClosable: true,
        });
        throw error;
      });
  };

  return (
    <>
      <CommonSEO
        title="Đổi mật khẩu - Vietlach"
        ogImage={getSocialImage()}
        noIndex={true}
      />
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px={{ base: "16px", sm: 0 }}
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
          mt="12"
          mx={{ base: "auto", sm: "32" }}
        >
          <Flex
            as="form"
            flexDirection="column"
            gap="3"
            w="full"
            onSubmit={handleSubmit(handleUpdate)}
          >
            <Flex flexDirection="column" gap="3">
              <FormControl isInvalid={errors.newPassword}>
                <Input
                  type="password"
                  placeholder="Mật khẩu mới"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <FormErrorMessage>
                    {errors.newPassword?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={errors.newPasswordAgain}>
                <Input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  {...register("newPasswordAgain")}
                />
                {errors.newPasswordAgain && (
                  <FormErrorMessage>
                    {errors.newPasswordAgain?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Flex>
            <Button type="submit">Cập nhật</Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
