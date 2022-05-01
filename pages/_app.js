import { ChakraProvider } from "@chakra-ui/react";
import ErrorBoundary from "components/error-boundary";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import "../styles/globals.css";
import { chakraExtendedTheme } from "styles/theme/theme";
import { CustomAxiosInterceptors } from "components/custom-axios-interceptors";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const path = router.asPath;

    if (path.includes("#access_token=")) {
      const infos = path
        .split("#")
        .at(-1)
        .split("&")
        .reduce((accum, pair) => {
          const [key, value] = pair.split("=");
          return { ...accum, [key]: value };
        }, {});
      auth.createUser(infos, true).then(() => {
        window.location.href = "/";
      });
    } else {
      const currentUser = auth.currentUser();
      if (currentUser) {
        mainAPI.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${currentUser.token.access_token}`;
      }
    }

    const redirectTo = "/cap-nhat-thong-tin";
    const currentUser = auth.currentUser();

    if (
      !path.startsWith(redirectTo) &&
      currentUser &&
      currentUser.user_metadata
    ) {
      if (
        !currentUser.user_metadata.full_name ||
        !currentUser.user_metadata.username
      ) {
        router.push(redirectTo);
      }
    }
  }, [router]);

  return (
    <ChakraProvider theme={chakraExtendedTheme}>
      <ErrorBoundary>
        <CustomAxiosInterceptors />
        <Component {...pageProps} />
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default MyApp;
