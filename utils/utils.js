export const getPostPath = (id, title) => {
  if (!id || !title) return "/";

  const allowed_symbols = [" ", ".", "-", "_"];

  const route = title
    .split("")
    .filter(
      (el) =>
        el.match(/^-?\d+$/) ||
        allowed_symbols.includes(el) ||
        el.toLowerCase() !== el.toUpperCase()
    )
    .map((el) => (allowed_symbols.includes(el) ? "-" : el))
    .join("");

  return `/bai-viet/${route}-${id}`;
};

export const getPostIDFromPath = (path) => {
  const tokens = path.split("-");
  return tokens.length > 1 ? tokens[tokens.length - 1] : 0;
};
