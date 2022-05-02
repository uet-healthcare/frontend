import { auth } from "utils/auth";
import {
  Box,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BiCog, BiLock, BiLogOut, BiUser } from "react-icons/bi";
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
        backgroundColor="red.50"
        color="red.800"
      >
        G
      </Flex>
    );
  }
  const metadata = userState.data.user_metadata;

  return (
    <Box fontSize="sm">
      <Menu placement="bottom-end">
        <MenuButton>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexShrink="0"
            borderRadius="lg"
            w="7"
            h="7"
            backgroundColor="red.50"
            color="red.800"
          >
            {metadata?.avatar_url ? (
              <Image
                src={metadata?.avatar_url}
                flexShrink="0"
                borderRadius="lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              metadata?.full_name?.[0] || "G"
            )}
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuGroup title="Cá nhân">
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
          </MenuGroup>
          <MenuGroup title="Cài đặt">
            <Link href="/cap-nhat-thong-tin">
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
    </Box>
  );
}
