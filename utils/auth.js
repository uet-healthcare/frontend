import GoTrue from "gotrue-js";

export const auth = new GoTrue({
  APIUrl: process.env.NEXT_PUBLIC_AUTH_URL,
  audience: process.env.NEXT_PUBLIC_AUTH_AUD,
  setCookie: false,
});

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("gotrue.user");
  return raw ? JSON.parse(raw) : null;
};
