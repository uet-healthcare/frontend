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
import { useGlobalConfirmDialog } from "hooks/use-global";
import { appContext } from "pages/_app";
import { useContext, useRef } from "react";

export default function GlobalConfirmDialog() {
  const appState = useContext(appContext);
  const confirmObject = appState.global.confirm;
  const confirmDialog = useGlobalConfirmDialog();

  const cancelRef = useRef();

  const onClose = () => confirmDialog(null);

  return (
    <AlertDialog
      isOpen={confirmObject}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <Box mx="4">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {confirmObject?.title || "Bạn có chắc chắn?"}
            </AlertDialogHeader>

            <AlertDialogBody>{confirmObject?.message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Bỏ qua
              </Button>
              <Button
                colorScheme="green"
                onClick={confirmObject?.action.onAction}
                ml={3}
              >
                {confirmObject?.action.name}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </Box>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
