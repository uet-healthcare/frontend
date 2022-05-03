import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import { setupStorage } from "utils/storage";

export function HandleRedirectUpdateInformation() {
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
        window.open("/", "_self");
      });
    } else {
      const currentUser = auth.currentUser();
      if (currentUser) {
        const accessToken = currentUser.token.access_token;
        mainAPI.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        setupStorage(accessToken);
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

  return null;
}
