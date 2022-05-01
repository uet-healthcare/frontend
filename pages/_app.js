import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "components/error-boundary";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { chakraExtendedTheme } from "styles/theme/theme";
import { CustomAxiosInterceptors } from "components/global/custom-axios-interceptors";
import { HandleRouteChange } from "components/global/handle-route-change";
import { HandleRedirectUpdateInformation } from "components/global/handle-redirect-update-information";
import React from "react";
import GlobalAlertDialog from "components/global/global-alert-dialog";
import GlobalConfirmDialog from "components/global/global-confirm-dialog";

export const appContext = React.createContext(null);
appContext.displayName = "GlobalContext";

function MyApp({ Component, pageProps }) {
  const [globalState, setGlobalState] = React.useState({
    alert: null,
  });

  return (
    <appContext.Provider
      value={{ global: globalState, setGlobal: setGlobalState }}
    >
      <ChakraProvider theme={chakraExtendedTheme}>
        <ErrorBoundary>
          <CustomAxiosInterceptors />
          <HandleRouteChange />
          <HandleRedirectUpdateInformation />
          <GlobalAlertDialog />
          <GlobalConfirmDialog />
          <Component {...pageProps} />
        </ErrorBoundary>
      </ChakraProvider>
    </appContext.Provider>
  );
}

export default MyApp;
