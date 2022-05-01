import { useEffect } from "react";
import { Router } from "next/router";
import nprogress from "nprogress";

export function HandleRouteChange() {
  useEffect(() => {
    const start = () => {
      nprogress.start();
    };
    const end = () => {
      nprogress.done();
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return null;
}
