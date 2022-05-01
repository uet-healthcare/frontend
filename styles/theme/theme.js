import { extendTheme, theme as base } from "@chakra-ui/react";

export const chakraExtendedTheme = extendTheme({
  fonts: {
    heading: `Avenir Next Pro, ${base.fonts.heading}`,
    body: `Avenir Next, ${base.fonts.body}`,
  },
  styles: {},
});
