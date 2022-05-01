import { Box, Button, Flex, Icon, Input, VStack } from "@chakra-ui/react";
import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import { removeVietnameseTones } from "utils/string";

const USERNAME_EXISTED_MESSAGE = "Rất tiếc, username này đã tồn tại!";

export default function UpdateInfo() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [isProcessing, setIsProcessing] = useState({
    checkUsername: false,
    editUsername: false,
  });
  const [error, setError] = useState({
    fullname: null,
    username: null,
  });

  useEffect(() => {
    const { user_metadata } = auth.currentUser();
    setFullname(user_metadata.full_name);
    if (user_metadata.username) {
      setUsername(user_metadata.username);
    }
  }, []);

  useEffect(() => {
    if (!fullname) {
      const { user_metadata } = auth.currentUser();
      if (!user_metadata.username) setUsername("");
      return;
    }
    if (
      !/^[a-z0-9 ]+$/g.test(removeVietnameseTones(fullname.toLowerCase())) ||
      /  /g.test(fullname)
    ) {
      setError((prevState) => ({
        ...prevState,
        fullname: "Tên không hợp lệ.",
      }));
    } else {
      setError((prevState) => ({ ...prevState, fullname: null }));
    }
    const { user_metadata } = auth.currentUser();
    if (user_metadata.username) return;

    const usernameBase = removeVietnameseTones(fullname)
      .split("")
      .filter((c) => /[a-z0-9]/g.test(c.toLowerCase()))
      .join("")
      .toLowerCase();
    const suggestUsername = async (username, attempt) => {
      const tryUsername = attempt === 0 ? username : `${username}${attempt}`;
      try {
        const { data } = await mainAPI.post(
          `/private/settings/username_check`,
          { username }
        );
        if (data.is_available) return setUsername(tryUsername);
        return await suggestUsername(username, attempt + 1);
      } catch (error) {
        setUsername(`${usernameBase}${Date.now()}`);
      }
    };

    suggestUsername(usernameBase, 0);
  }, [fullname]);

  useEffect(() => {
    if (!isProcessing.editUsername || !username) return;
    const { user_metadata } = auth.currentUser();
    if (username === user_metadata.username) {
      setError((prevState) => ({ ...prevState, username: null }));
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/g.test(username)) {
      setError((prevState) => ({
        ...prevState,
        username: "Username không hợp lệ",
      }));
      return;
    }

    setIsProcessing((prevState) => ({ ...prevState, checkUsername: true }));
    const timeoutID = setTimeout(() => {
      mainAPI
        .post(`/private/settings/username_check`, { username })
        .then((response) => {
          if (
            response.status === 200 &&
            response.data &&
            !response.data.is_available
          ) {
            setError((prevState) => ({
              ...prevState,
              username: USERNAME_EXISTED_MESSAGE,
            }));
          }
        })
        .finally(() => {
          setIsProcessing((prevState) => ({
            ...prevState,
            checkUsername: false,
          }));
        });
    }, 1000);
    return () => clearTimeout(timeoutID);
  }, [isProcessing.editUsername, username]);

  const handleUpdate = (event) => {
    event.preventDefault();
    if (Object.values(error).find((errMsg) => errMsg)) {
      return;
    }

    auth
      .currentUser()
      .update({
        data: {
          full_name: fullname,
          username: username,
        },
      })
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        alert("Thông tin không hợp lệ hoặc username đã tồn tại.");
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
        mt="12"
        flexDirection="column"
        gap="4"
        rowGap={{ base: "4", md: "8" }}
        lineHeight="tall"
        color="gray.900"
        fontSize={{ md: "lg" }}
      >
        <Box as="form" mx={{ sm: "32" }} onSubmit={handleUpdate}>
          <Flex flexDirection="column" w="full" gap="4">
            <Box>
              <Box mb="1" fontSize="sm" fontWeight="semibold" color="gray.500">
                Tên của bạn
              </Box>
              <Input
                placeholder="Bạn tên là gì nè?"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
              {error.fullname && (
                <Box mt="1" fontSize="sm" color="red.600">
                  {error.fullname}
                </Box>
              )}
            </Box>
            {isProcessing.editUsername && (
              <Box w="full">
                <Box
                  mb="1"
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.500"
                >
                  Username
                </Box>
                <Input
                  placeholder="Username của bạn"
                  value={username}
                  pattern="[a-zA-Z0-9.-_]+"
                  onChange={(e) => setUsername(e.target.value)}
                />
                {!isProcessing.checkUsername ? (
                  error.username && (
                    <Box mt="1" fontSize="sm" color="red.600">
                      {error.username}
                    </Box>
                  )
                ) : (
                  <Box mt="1" fontSize="sm" color="gray.500">
                    Đang kiểm tra...
                  </Box>
                )}
              </Box>
            )}
            {username &&
              !isProcessing.checkUsername &&
              (!isProcessing.editUsername || !error.username) && (
                <Flex gap="1" fontSize="sm" color="gray.500">
                  <Box w="full">
                    <Box>Trang cá nhân của bạn sẽ là:</Box>
                    <Box
                      as="strong"
                      fontWeight="semibold"
                      wordBreak="break-all"
                    >
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
          <Button mt="4" isFullWidth>
            Cập nhật
          </Button>
        </Box>
      </Flex>
    </>
  );
}
