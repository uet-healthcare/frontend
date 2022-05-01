import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
} from "@chakra-ui/react";
import { appContext } from "pages/_app";
import { useContext, useRef } from "react";

export default function GlobalAlertDialog({}) {
  const appState = useContext(appContext);
  const alertObject = appState.global.alert;
  const cancelRef = useRef();

  const onClose = () =>
    appState.setGlobal((prevState) => ({ ...prevState, alert: null }));

  return (
    <AlertDialog
      isOpen={alertObject}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <Box mx="4">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {alertObject?.title || "Đã có lỗi xảy ra"}
            </AlertDialogHeader>

            <AlertDialogBody>{alertObject?.message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Đóng
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Box>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
