import { useEffect, useState } from "react";
import { auth } from "utils/auth";
import { DEFAULT_USER_METADATA } from "utils/constants";
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { BiCog, BiLock, BiLogOut, BiUser } from "react-icons/bi";
import Link from "next/link";

export default function AvatarDropdown({}) {
  const [userMetaData, setUserMetaData] = useState(DEFAULT_USER_METADATA);

  useEffect(() => {
    setUserMetaData(auth.currentUser().user_metadata);
  }, []);

  return (
    <Menu>
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
          {userMetaData.avatar_url ? (
            <Image
              src={userMetaData.avatar_url}
              flexShrink="0"
              borderRadius="lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            userMetaData.full_name?.[0] || "G"
          )}
        </Flex>
      </MenuButton>
      <MenuList>
        <Link href={`/${userMetaData.username}`}>
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
              .then((response) => {
                window.localStorage.clear();
                window.location.href = "/";
              })
              .catch((error) => {
                alert(error);
              });
          }}
        >
          Đăng xuất
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
