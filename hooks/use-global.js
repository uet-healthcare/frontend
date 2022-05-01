import { useContext } from "react";
import { appContext } from "pages/_app";

export function useGlobalAlertDialog(props) {
  const appState = useContext(appContext);

  const doAlert = (props) => {
    appState.setGlobal((prevState) => ({ ...prevState, alert: props }));
  };

  return doAlert;
}

export function useGlobalConfirmDialog(props) {
  const appState = useContext(appContext);

  const doConfirm = (props) => {
    appState.setGlobal((prevState) => ({ ...prevState, confirm: props }));
  };

  return doConfirm;
}
