import { GoogleLoginButton } from "components/google-login-button";
import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "utils/auth";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");

  const handleUpdate = (event) => {
    event.preventDefault();

    auth
      .currentUser()
      .update({ password: newPassword })
      .then((user) => {
        alert("Cập nhật thông tin thành công!");
        console.log("Updated user %s", user);
      })
      .catch((error) => {
        alert("Đã có lỗi xảy ra, vui lòng thử lại.");
        console.log("Failed to update user: %o", error);
        throw error;
      });
  };

  return (
    <>
      <div className="flex items-center justify-between w-full max-w-screen-sm px-16 md:px-0 md:mx-auto">
        <Link href="/">
          <a className="py-12 text-xl font-bold font-body">
            <span className="text-gray-900">vietlach</span>
            <span className="text-rose-400">.vn</span>
          </a>
        </Link>
        <AvatarDropdown />
      </div>
      <hr />
      <div className="max-w-screen-sm mx-16 space-y-16 leading-relaxed text-gray-900 md:mx-auto md:text-lg md:space-y-24">
        <div className="flex flex-col items-center max-w-xs gap-16 mx-auto mt-64">
          <form className="space-y-20" onSubmit={handleUpdate}>
            <div className="space-y-12">
              <input
                className="w-full px-16 py-12 text-sm border rounded-lg"
                placeholder="Mật khẩu cũ"
                value={currentPassword}
                type="password"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                className="w-full px-16 py-12 text-sm border rounded-lg"
                placeholder="Mật khẩu mới"
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                className="w-full px-16 py-12 text-sm border rounded-lg"
                placeholder="Xác nhận mật khẩu mới"
                value={newPasswordAgain}
                type="password"
                pattern={newPassword}
                onChange={(e) => setNewPasswordAgain(e.target.value)}
              />
            </div>
            <button className="w-full px-16 py-8 text-white rounded bg-rose-300 hover:bg-rose-400 disabled:cursor-not-allowed">
              Cập nhật
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
