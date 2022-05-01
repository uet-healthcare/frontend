import { useEffect } from "react";
import { useRouter } from "next/router";
import { mainAPI } from "utils/axios";
import { useGlobalAlertDialog, useGlobalConfirmDialog } from "hooks/use-global";

export function CustomAxiosInterceptors() {
  const router = useRouter();

  const alertDialog = useGlobalAlertDialog();
  const confirmDialog = useGlobalConfirmDialog();

  useEffect(() => {
    // Add a response interceptor
    mainAPI.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        if (error.toJSON().message === "Network Error") {
          alertDialog({
            title: "Mất kết nối",
            message:
              "Không thể kết nối tới server. Vui lòng kiểm tra lại đường truyền internet của bạn.",
          });
        } else if (error.response?.status === 401) {
          let title;
          const message = "Vui lòng đăng nhập để sử dụng chức năng này";
          const action = {
            name: "Đăng nhập lại",
            onAction: () => {
              window.localStorage.clear();
              window.open("/dang-nhap", "_self");
            },
          };
          if (window.localStorage.getItem("gotrue.user")) {
            title = "Phiên đăng nhập đã hết hạn";
          } else {
            title = "Bạn chưa đăng nhập";
          }
          confirmDialog({ title, message, action });
        } else if (
          error.response?.status >= 500 &&
          error.response?.status < 600
        ) {
          alertDialog({
            title: "Lỗi hệ thống",
            message:
              "Vui lòng thử lại sau hoặc liên hệ quản trị viên để được hỗ trợ.",
          });
        }

        return Promise.reject(error);
      }
    );
  }, [router, alertDialog, confirmDialog]);

  return null;
}
