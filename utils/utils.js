import { mainAPI } from "./axios";
import { base64_encode } from "./base64";
import { SITE_URL } from "./constants";
import { removeVietnameseTones } from "./string";

export const getPostPath = (id, username, title) => {
  if (!id || !title) return "/";

  const allowed_symbols = [" ", ".", "-", "_"];

  const route = removeVietnameseTones(title)
    .split("")
    .filter(
      (el) =>
        el.match(/^-?\d+$/) ||
        allowed_symbols.includes(el) ||
        el.toLowerCase() !== el.toUpperCase()
    )
    .map((el) => (allowed_symbols.includes(el) ? "-" : el))
    .join("");

  return `/${username}/${route}-${id}`;
};

export const getPostIDFromPath = (path) => {
  const tokens = path.split("-");
  return tokens.length > 1 ? tokens[tokens.length - 1] : 0;
};

export const suggestUsername = async (fullname) => {
  if (!fullname) return "";

  const base = removeVietnameseTones(fullname)
    .split("")
    .filter((c) => /[a-z0-9]/g.test(c.toLowerCase()))
    .join("")
    .toLowerCase();

  for (let attempt = 0; attempt < 1000; attempt++) {
    const tryUsername = attempt === 0 ? base : `${base}${attempt}`;
    try {
      const response = await mainAPI.post(`/private/settings/username_check`, {
        username: tryUsername,
      });
      const responseData = response.data;

      if (responseData.data.is_available) {
        return tryUsername;
      }
    } catch (error) {
      return `${base}${Date.now()}`;
    }
  }
  return `${base}${Date.now()}`;
};

export const getSocialImage = (props) => {
  if (!props) return `${SITE_URL}/social-image.png`;
  const { path, title, subtitle } = props;
  return `${SITE_URL}/api/image?title=${base64_encode(
    title
  )}&subtitle=${base64_encode(subtitle)}&path=${base64_encode(path)}`;
};

export const generateRandomFileName = (file) => {
  const now = Date.now();
  const currentDate = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const randomString =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  const nameTokens = file.name.split(".");
  let ext =
    nameTokens.length > 1 ? `.${nameTokens[nameTokens.length - 1]}` : "";

  return `${currentDate}-${now}-${randomString}${ext}`;
};

export const reduceContent = (content) => {
  let finalContent = content.trim();
  finalContent = finalContent.endsWith("\\")
    ? finalContent.substring(0, finalContent.length - 1)
    : finalContent;
  return finalContent;
};
