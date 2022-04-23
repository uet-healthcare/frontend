import { Pencil1Icon } from "@radix-ui/react-icons";
import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";
import { useEffect, useState } from "react";
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
          <form className="w-full space-y-20" onSubmit={handleUpdate}>
            <div className="space-y-12">
              <div>
                <div className="mb-4 text-sm font-semibold text-gray-500">
                  Tên của bạn
                </div>
                <input
                  className="w-full px-16 py-12 text-sm border rounded-lg"
                  placeholder="Bạn tên là gì nè?"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                {error.fullname && (
                  <div className="mt-4 text-sm text-red-600">
                    {error.fullname}
                  </div>
                )}
              </div>
              {isProcessing.editUsername && (
                <div className="w-full">
                  <div className="mb-4 text-sm font-semibold text-gray-500">
                    Username
                  </div>
                  <input
                    className="w-full px-16 py-12 text-sm border rounded-lg"
                    placeholder="Username của bạn"
                    value={username}
                    pattern="[a-zA-Z0-9.-_]+"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {!isProcessing.checkUsername ? (
                    error.username && (
                      <div className="mt-4 text-sm text-red-600">
                        {error.username}
                      </div>
                    )
                  ) : (
                    <div className="mt-4 text-sm text-gray-500">
                      Đang kiểm tra...
                    </div>
                  )}
                </div>
              )}
              {username &&
                !isProcessing.checkUsername &&
                (!isProcessing.editUsername || !error.username) && (
                  <div className="text-sm text-gray-500">
                    <div>Trang cá nhân của bạn sẽ là:</div>
                    <div className="flex items-center w-full gap-12">
                      <strong className="font-semibold break-all">
                        https://vietlach.vn/{username || "username"}
                      </strong>
                      {!isProcessing.editUsername && (
                        <button
                          type="button"
                          onClick={() =>
                            setIsProcessing((prevState) => ({
                              ...prevState,
                              editUsername: true,
                            }))
                          }
                          className="text-sm"
                        >
                          <Pencil1Icon />
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
