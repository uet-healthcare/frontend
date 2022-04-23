import DropdownMenu from "components/ui/dropdown-menu";
import {
  AvatarIcon,
  ExitIcon,
  GearIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { auth } from "utils/auth";
import { DEFAULT_USER_METADATA } from "utils/constants";

export default function AvatarDropdown({}) {
  const [userMetaData, setUserMetaData] = useState(DEFAULT_USER_METADATA);

  useEffect(() => {
    setUserMetaData(auth.currentUser().user_metadata);
  }, []);

  return (
    <DropdownMenu
      items={[
        {
          label: "Trang cá nhân",
          icon: <AvatarIcon className="mr-8 h-14 w-14 " />,
          link: `/${userMetaData.username}`,
        },
        {
          label: "Cập nhật thông tin",
          icon: <MixerHorizontalIcon className="mr-8 h-14 w-14 " />,
          link: "/cap-nhat-thong-tin",
        },
        {
          label: "Đổi mật khẩu",
          icon: <GearIcon className="mr-8 h-14 w-14 " />,
          link: "/doi-mat-khau",
        },
        {
          label: "Đăng xuất",
          icon: <ExitIcon className="mr-8 h-14 w-14 " />,
          onClick: () => {
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
          },
        },
      ]}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 rounded-lg w-28 h-28 bg-rose-50 text-rose-800">
        {userMetaData.avatar_url ? (
          <img
            src={userMetaData.avatar_url}
            className="flex-shrink-0 rounded-lg w-28 h-28"
            referrerPolicy="no-referrer"
          />
        ) : (
          userMetaData.full_name?.[0] || "G"
        )}
      </div>
    </DropdownMenu>
  );
}
