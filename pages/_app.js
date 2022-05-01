import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "components/error-boundary";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { chakraExtendedTheme } from "styles/theme/theme";
import { CustomAxiosInterceptors } from "components/custom-axios-interceptors";
import { HandleRouteChange } from "components/handle-route-change";
import { HandleRedirectUpdateInformation } from "components/handle-redirect-update-information";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={chakraExtendedTheme}>
      <ErrorBoundary>
        <CustomAxiosInterceptors />
        <HandleRouteChange />
        <HandleRedirectUpdateInformation />
        <Component {...pageProps} />
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
