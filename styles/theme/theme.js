import {
  extendTheme,
  theme as base,
  withDefaultColorScheme,
} from "@chakra-ui/react";

export const chakraExtendedTheme = extendTheme(
  {
    sizes: {
      ...base.space,
      container: {
        sm: "692px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    breakpoints: {
      sm: "30em",
      md: "48em",
      lg: "68em",
      xl: "80em",
      "2xl": "96em",
    },
    colors: {
      brand: {
        50: "#fdd9df",
        100: "#fcc5cf",
        200: "#fbb2bf",
        300: "#fa9faf",
        400: "#f88c9e",
        500: "#f7798e",
        600: "#f6657e",
        700: "#f5526e",
        800: "#f43f5e",
        900: "#e11d48",
      },
    },
    fonts: {
      heading: `Avenir Next Pro, ${base.fonts.heading}`,
      body: `Avenir Next, ${base.fonts.body}`,
    },
    styles: {},
  },
  withDefaultColorScheme({
    colorScheme: "gray",
    components: ["Button"],
  })
);
