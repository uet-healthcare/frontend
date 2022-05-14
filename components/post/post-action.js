import {
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { BiDotsHorizontalRounded, BiEdit, BiTrash } from "react-icons/bi";
import Link from "next/link";
import { useUserState } from "hooks/use-user-state";
import { useGlobalConfirmDialog } from "hooks/use-global";
import { mainAPI } from "utils/axios";
import { useRouter } from "next/router";

export default function PostAction({ post }) {
  const router = useRouter();
  const toast = useToast();
  const userState = useUserState();
  const confirmDialog = useGlobalConfirmDialog();

  if (
    !userState.isLoggedIn ||
    userState.metadata.username !== post.author.username
  ) {
    return null;
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton>
        <IconButton
          colorScheme="gray"
          variant="ghost"
          as={BiDotsHorizontalRounded}
          w="6"
          h="6"
          color="gray.400"
          _hover={{ color: "gray.900" }}
        />
      </MenuButton>
      <MenuList fontSize="sm">
        <Link href={`/me/sua-bai-viet/${post.post_id}`}>
          <a>
            <MenuItem
              icon={
                <Flex alignItems="center">
                  <Icon as={BiEdit} w="3.5" h="3.5" />
                </Flex>
              }
            >
              Sửa bài viết
            </MenuItem>
          </a>
        </Link>
        <MenuItem
          icon={
            <Flex alignItems="center">
              <Icon as={BiTrash} w="3.5" h="3.5" />
            </Flex>
          }
          onClick={() => {
            confirmDialog({
              title: "Xóa bài viết",
              message: "Bạn có chắc muốn xóa bài viết này?",
              action: {
                name: "Xoá bài viết",
                onAction: async ({ finishLoading, resolve }) => {
                  mainAPI
                    .delete("/private/posts", {
                      data: {
                        id: post.post_id,
                      },
                    })
                    .then((response) => {
                      const responseData = response.data;
                      if (
                        response.status === 200 &&
                        responseData &&
                        responseData.success &&
                        responseData.data.rows_deleted > 0
                      ) {
                        resolve();
                        toast({
                          title: "Xoá bài viết thành công!",
                          status: "success",
                          isClosable: true,
                        });
                        router.push("/");
                      } else {
                        toast({
                          title: "Đã có lỗi xảy ra",
                          message:
                            "Xóa bài viết không thành công. Vui lòng thử lại.",
                          status: "error",
                          isClosable: true,
                        });
                      }
                    })
                    .catch((error) => {
                      toast({
                        title: "Đã có lỗi xảy ra",
                        message:
                          "Xóa bài viết không thành công. Vui lòng thử lại.",
                        status: "error",
                        isClosable: true,
                      });
                      console.error(error);
                    })
                    .finally(() => {
                      finishLoading();
                    });
                },
              },
            });
          }}
        >
          Xóa bài viết
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
