import { auth } from "utils/auth";
import {
  Avatar,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BiCog, BiFile, BiLock, BiLogOut, BiUser } from "react-icons/bi";
import Link from "next/link";
import { useUserState } from "hooks/use-user-state";
import { useGlobalAlertDialog } from "hooks/use-global";

export default function AvatarDropdown({}) {
  const userState = useUserState();
  const alertDialog = useGlobalAlertDialog();

  if (!userState.isLoggedIn) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
        borderRadius="lg"
        w="7"
        h="7"
        backgroundColor="gray.100"
        color="gray.800"
      >
        G
      </Flex>
    );
  }
  const metadata = userState.metadata;

  return (
    <Menu placement="bottom-end">
      <MenuButton type="button">
        <Flex
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          borderRadius="lg"
          w="7"
          h="7"
          backgroundColor="gray.100"
          color="gray.800"
        >
          <Avatar
            src={metadata?.avatar_url}
            name={metadata?.full_name}
            size="sm"
          />
        </Flex>
      </MenuButton>
      <MenuList fontSize="sm">
        <MenuGroup title={metadata?.username}>
          <Link href={`/${metadata?.username}`}>
            <a>
              <MenuItem
                icon={
                  <Flex alignItems="center">
                    <Icon as={BiUser} w="3.5" h="3.5" />
                  </Flex>
                }
              >
                Trang cá nhân
              </MenuItem>
            </a>
          </Link>
          <Link href={`/me/bai-viet`}>
            <a>
              <MenuItem
                icon={
                  <Flex alignItems="center">
                    <Icon as={BiFile} w="3.5" h="3.5" />
                  </Flex>
                }
              >
                Câu hỏi của tôi
              </MenuItem>
            </a>
          </Link>
          <Link href={`/kiem-tra-suc-khoe`}>
            <a>
              <MenuItem
                icon={
                  <Flex alignItems="center">
                    <Icon as={BiFile} w="3.5" h="3.5" />
                  </Flex>
                }
              >
                Kiểm tra sức khỏe
              </MenuItem>
            </a>
          </Link>
        </MenuGroup>
        <MenuGroup title="Cài đặt">
          <Link href="/me/thong-tin">
            <a>
              <MenuItem
                icon={
                  <Flex alignItems="center">
                    <Icon as={BiCog} w="3.5" h="3.5" />
                  </Flex>
                }
              >
                Cập nhật thông tin
              </MenuItem>
            </a>
          </Link>
          <Link href="/doi-mat-khau">
            <a>
              <MenuItem
                icon={
                  <Flex alignItems="center">
                    <Icon as={BiLock} w="3.5" h="3.5" />
                  </Flex>
                }
              >
                Đổi mật khẩu
              </MenuItem>
            </a>
          </Link>
        </MenuGroup>
        <MenuItem
          icon={
            <Flex alignItems="center">
              <Icon as={BiLogOut} w="3.5" h="3.5" />
            </Flex>
          }
          onClick={() => {
            auth
              .currentUser()
              .logout()
              .then(() => {
                window.localStorage.clear();
                window.open("/", "_self");
              })
              .catch((error) => {
                alertDialog({ message: error });
              });
          }}
        >
          Đăng xuất
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
