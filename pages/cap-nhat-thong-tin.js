import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import AvatarDropdown from "components/global/header-avatar-dropdown";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import { removeVietnameseTones } from "utils/string";
import * as yup from "yup";

const USERNAME_EXISTED_MESSAGE = "Rất tiếc, username này đã tồn tại!";

export default function UpdateInfo() {
  const toast = useToast();
  const userState = useUserState();

  const schemas = yup.object().shape({
    username: yup
      .string()
      .required("Bạn chưa nhập username")
      .matches(/^[a-zA-Z0-9._-]+$/g, {
        excludeEmptyString: true,
        message: "Username không hợp lệ",
      })
      .test("username", USERNAME_EXISTED_MESSAGE, async (username) => {
        if (!username) return true;
        if (
          userState.isLoggedIn &&
          username === userState.data.user_metadata.username
        ) {
          return true;
        }
        return (
          await mainAPI.post(`/private/settings/username_check`, {
            username: username,
          })
        ).data.is_available;
      }),
    fullname: yup
      .string()
      .required("Bạn chưa nhập tên")
      .test("fullname", "Tên không hợp lệ", (fullname) =>
        fullname
          ? /^[a-z0-9 ]+$/g.test(
              removeVietnameseTones(fullname.toLowerCase())
            ) && !/  /g.test(fullname)
          : true
      ),
  });

  const [isProcessing, setIsProcessing] = useState({
    checkUsername: false,
    editUsername: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemas) });

  const startCheckUsername = () =>
    setIsProcessing((prevState) => ({
      ...prevState,
      checkUsername: true,
    }));

  const stopCheckUsername = () =>
    setIsProcessing((prevState) => ({
      ...prevState,
      checkUsername: false,
    }));

  useEffect(() => {
    const { user_metadata } = auth.currentUser();
    setValue("fullname", user_metadata.full_name);
    if (user_metadata.username) {
      setValue("username", user_metadata.username);
    }
  }, [setValue]);

  useEffect(() => {
    const { user_metadata } = auth.currentUser();
    let timeoutID;

    const suggestUsername = async (base, attempt) => {
      if (!base) return "";
      const tryUsername = attempt === 0 ? base : `${base}${attempt}`;
      try {
        const { data } = await mainAPI.post(
          `/private/settings/username_check`,
          { username: tryUsername }
        );
        if (data.is_available) {
          setValue("username", tryUsername);
          return tryUsername;
        } else {
          return await suggestUsername(base, attempt + 1);
        }
      } catch (error) {
        return `${base}${Date.now()}`;
      }
    };

    const subscription = watch(async (values, { name, type }) => {
      if (name === "fullname") {
        clearTimeout(timeoutID);
        if (!values.fullname) {
          if (!user_metadata.username) setValue("username", "");
          return;
        }
        if (user_metadata.username) return;
        const usernameBase = removeVietnameseTones(values.fullname)
          .split("")
          .filter((c) => /[a-z0-9]/g.test(c.toLowerCase()))
          .join("")
          .toLowerCase();

        startCheckUsername();
        timeoutID = setTimeout(async () => {
          const newUsername = await suggestUsername(usernameBase, 0);
          setValue("username", newUsername);
          stopCheckUsername();
        }, 500);
      } else if (name === "username") {
        clearTimeout(timeoutID);

        if (!values.username || values.username === user_metadata.username) {
          clearErrors("username");
          stopCheckUsername();

          return;
        }

        startCheckUsername();
        timeoutID = setTimeout(async () => {
          await trigger("username");
          stopCheckUsername();
        }, 500);
      }
    });

    return () => {
      clearTimeout(timeoutID);
      subscription.unsubscribe();
    };
  }, [watch, setValue, clearErrors, isProcessing.editUsername, trigger]);

  const handleUpdate = (data) => {
    auth
      .currentUser()
      .update({
        data: {
          full_name: data.fullname,
          username: data.username,
        },
      })
      .then(() => {
        toast({
          title: "Cập nhật thành công!",
          status: "success",
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Cập nhật thất bại",
          description: "Thông tin không hợp lệ hoặc username đã tồn tại.",
          status: "success",
          isClosable: true,
        });
        console.error(error);
      });
  };

  const username = watch("username");

  return (
    <>
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
        mt="12"
        flexDirection="column"
        gap="4"
        rowGap={{ base: "4", sm: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ sm: "lg" }}
      >
        <Box as="form" mx={{ sm: "32" }} onSubmit={handleSubmit(handleUpdate)}>
          <Flex flexDirection="column" w="full" gap="4">
            <Box>
              <FormControl isInvalid={errors.fullname}>
                <FormLabel htmlFor="fullname">Tên của bạn</FormLabel>
                <Input
                  placeholder="Bạn tên là gì nè?"
                  {...register("fullname")}
                />
                {errors.fullname && (
                  <FormErrorMessage>
                    {errors.fullname?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
            {isProcessing.editUsername && (
              <Box w="full">
                <FormControl isInvalid={errors.username}>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    placeholder="Username của bạn"
                    {...register("username")}
                  />
                  {errors.username && (
                    <FormErrorMessage>
                      {errors.username?.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
            )}
            {isProcessing.checkUsername && (
              <Box mt="1" fontSize="sm" color="gray.500">
                Đang kiểm tra...
              </Box>
            )}
            {!isProcessing.checkUsername && !errors.username && (
              <Flex gap="1" fontSize="sm" color="gray.500">
                <Box w="full">
                  <Box>Trang cá nhân của bạn sẽ là:</Box>
                  <Box as="strong" fontWeight="semibold" wordBreak="break-all">
                    https://vietlach.vn/{username || "username"}
                  </Box>
                </Box>
                <Flex alignItems="center" gap="3">
                  {!isProcessing.editUsername && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        setIsProcessing((prevState) => ({
                          ...prevState,
                          editUsername: true,
                        }))
                      }
                    >
                      <Icon as={BiPencil} />
                    </Button>
                  )}
                </Flex>
              </Flex>
            )}
          </Flex>
          <Button type="submit" mt="4" isFullWidth>
            Cập nhật
          </Button>
        </Box>
      </Flex>
    </>
  );
}
