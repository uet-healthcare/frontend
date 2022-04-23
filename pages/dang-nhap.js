import { GoogleLoginButton } from "components/google-login-button";
import Link from "next/link";
import { useState } from "react";
import { auth } from "utils/auth";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    auth
      .login(username, password, true)
      .then((response) => {
        window.location.href = "/";
      })
      .catch((error) => {
        alert(error);
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
        <div className="flex items-center gap-8 text-sm text-gray-500 hover:text-gray-700">
          <Link href="/dang-ky">
            <a>Đăng ký</a>
          </Link>
        </div>
      </div>
      <hr />
      <div className="max-w-screen-sm mx-16 space-y-16 leading-relaxed text-gray-900 md:mx-auto md:text-lg md:space-y-24">
        <div className="flex flex-col items-center max-w-xs gap-16 mx-auto mt-64">
          <GoogleLoginButton>Đăng nhập với Google</GoogleLoginButton>
          <div className="text-sm text-gray-500">hoặc</div>
          <form className="space-y-12" onSubmit={handleLogin}>
            <input
              className="w-full px-16 py-12 text-sm border rounded-lg"
              placeholder="Email của bạn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full px-16 py-12 text-sm border rounded-lg"
              placeholder="************"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full px-16 py-8 text-white rounded bg-rose-300 hover:bg-rose-400 disabled:cursor-not-allowed">
              Đăng nhập
            </button>
          </form>
          <div className="text-sm text-gray-500">
            Bạn chưa có tài khoản?{" "}
            <Link href="/dang-ky">
              <a className="underline">Đăng ký ngay</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
