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
      const { data } = await mainAPI.post(`/private/settings/username_check`, {
        username: tryUsername,
      });
      if (data.is_available) {
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
