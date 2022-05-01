import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { mainAPI } from "utils/axios";

export function CustomAxiosInterceptors() {
  const router = useRouter();

  const [alertMessage, setAlertMessage] = useState(null);
  const onClose = () => setAlertMessage(null);
  const cancelRef = useRef();

  useEffect(() => {
    // Add a response interceptor
    mainAPI.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        if (error.response.status === 401) {
          const message = "Vui lòng đăng nhập để sử dụng chức năng này";
          const action = {
            name: "Đăng nhập lại",
            onAction: () => {
              window.localStorage.clear();
              window.open("/dang-nhap", "_self");
            },
          };
          if (window.localStorage.getItem("gotrue.user")) {
            setAlertMessage({
              title: "Phiên đăng nhập đã hết hạn",
              message,
              action,
            });
          } else {
            setAlertMessage({ title: "Bạn chưa đăng nhập", message, action });
          }
        } else if (
          error.response.status >= 500 &&
          error.response.status < 600
        ) {
          setAlertMessage({
            title: "Lỗi hệ thống",
            message:
              "Vui lòng thử lại sau hoặc liên hệ quản trị viên để được hỗ trợ.",
            action: {
              name: "OK",
              action: onClose,
            },
          });
        }

        return Promise.reject(error);
      }
    );
  }, [router]);

  return (
    <>
      <AlertDialog
        isOpen={alertMessage}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertMessage?.title}
            </AlertDialogHeader>

            <AlertDialogBody>{alertMessage?.message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Bỏ qua
              </Button>
              <Button
                colorScheme="green"
                onClick={alertMessage?.action.onAction}
                ml={3}
              >
                {alertMessage?.action.name}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
