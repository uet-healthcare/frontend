import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import AvatarDropdown from "components/global/header-avatar-dropdown";
import { debounce } from "utils/debounce";
import { useUserState } from "hooks/use-user-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiPencil } from "react-icons/bi";
import { mainAPI } from "utils/axios";
import { removeVietnameseTones } from "utils/string";
import * as yup from "yup";
import { getSocialImage, suggestUsername } from "utils/utils";
import { CommonSEO } from "components/seo";
import { useRouter } from "next/router";

const USERNAME_EXISTED_MESSAGE = "Rất tiếc, username này đã tồn tại!";

export default function UpdateInfo() {
  const toast = useToast();
  const userState = useUserState();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState({
    checkUsername: false,
    editUsername: false,
  });

  const schemas = yup.object().shape({
    fullname: yup
      .string()
      .required("Bạn chưa điền tên")
      .test("fullname", "Tên không hợp lệ", (fullname) =>
        fullname
          ? /^[a-z0-9 ]+$/g.test(
              removeVietnameseTones(fullname.toLowerCase())
            ) && !/  /g.test(fullname)
          : true
      ),
    username: yup
      .string()
      .required("Bạn chưa điền username")
      .matches(/^[a-zA-Z0-9._-]+$/g, {
        excludeEmptyString: true,
        message: "Username không hợp lệ",
      })
      .test(
        "username",
        USERNAME_EXISTED_MESSAGE,
        (username) =>
          new Promise((resolve) => {
            if (!username || userState.metadata.username === username) {
              resolve(true);
              return;
            }

            startCheckUsername();
            debounce(
              "update-profile-username",
              async () => {
                const response = await mainAPI.post(
                  `/private/settings/username_check`,
                  {
                    username: username,
                  }
                );
                const responseData = response.data;
                resolve(
                  response.status === 200 &&
                    responseData.success &&
                    responseData.data?.is_available
                );
                stopCheckUsername();
              },
              500
            );
          })
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(schemas) });
  const formValues = watch();

  const startCheckUsername = useCallback(
    function startCheckUsername() {
      clearErrors("username");
      setIsProcessing((prevState) => ({
        ...prevState,
        checkUsername: true,
      }));
    },
    [clearErrors, setIsProcessing]
  );

  const stopCheckUsername = useCallback(
    function stopCheckUsername() {
      setIsProcessing((prevState) => ({
        ...prevState,
        checkUsername: false,
      }));
    },
    [setIsProcessing]
  );

  useEffect(() => {
    if (userState.isLoggedIn) {
      setValue("fullname", userState.metadata?.full_name);
      if (userState.metadata.username) {
        setValue("username", userState.metadata?.username);
      }
    }
  }, [setValue, userState]);

  useEffect(() => {
    if (dirtyFields.username) return;
    if (!userState.isLoggedIn) return;
    let timeoutID;

    if (!formValues.fullname) {
      if (!userState.metadata.username) setValue("username", "");
      return;
    }
    if (userState.metadata.username) return;
    startCheckUsername();
    timeoutID = setTimeout(async () => {
      const newUsername = await suggestUsername(formValues.fullname);
      setValue("username", newUsername);
      stopCheckUsername();
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [
    userState,
    formValues.fullname,
    setValue,
    startCheckUsername,
    stopCheckUsername,
    dirtyFields,
  ]);

  const handleUpdate = (data) => {
    mainAPI
      .put(`/private/users/metadata`, {
        full_name: data.fullname,
        username: data.username,
      })
      .then((response) => {
        const responseData = response.data;
        if (response.status === 200 && responseData.success) {
          toast({
            title: "Cập nhật thành công!",
            status: "success",
            isClosable: true,
          });
          window.localStorage.removeItem("user_metadata");
          setTimeout(() => window.open("/", "_self"), 500);
        }
      })
      .catch((error) => {
        toast({
          title: "Cập nhật thất bại",
          description: "Thông tin không hợp lệ hoặc username đã tồn tại.",
          status: "error",
          isClosable: true,
        });
        console.error(error);
      });
  };

  return (
    <>
      <CommonSEO
        title="Cập nhật thông tin tài khoản - Vietlach"
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
              <Box as="span" color="gray.500">
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
        <Box as="form" onSubmit={handleSubmit(handleUpdate)}>
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
              <Box w="full" fontSize="sm" color="gray.500">
                Đang kiểm tra...
              </Box>
            )}
            {formValues.username &&
              !isProcessing.checkUsername &&
              !errors.username && (
                <Flex gap="1" fontSize="sm" color="gray.500">
                  <Box w="full">
                    <Box>Trang cá nhân của bạn sẽ là:</Box>
                    <Box
                      as="strong"
                      fontWeight="semibold"
                      wordBreak="break-all"
                    >
                      https://vietlach.vn/{formValues.username || "username"}
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
