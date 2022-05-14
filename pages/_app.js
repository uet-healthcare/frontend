import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "components/error-boundary";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { chakraExtendedTheme } from "styles/theme/theme";
import { CustomAxiosInterceptors } from "components/global/custom-axios-interceptors";
import { HandleRouteChange } from "components/global/handle-route-change";
import { HandleRedirectUpdateInformation } from "components/global/handle-redirect-update-information";
import React, { useEffect } from "react";
import GlobalAlertDialog from "components/global/global-alert-dialog";
import GlobalConfirmDialog from "components/global/global-confirm-dialog";
import Script from "next/script";
import { useRouter } from "next/router";

export const appContext = React.createContext(null);
appContext.displayName = "GlobalContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [globalState, setGlobalState] = React.useState({
    alert: null,
  });

  useEffect(() => {
    if (!router.isReady) return;
    // remove back path from localStorage
    window.localStorage.removeItem("_vlcfp");
  }, [router]);

  return (
    <>
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
          `}
      </Script>

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
    </>
  );
}

export default MyApp;
