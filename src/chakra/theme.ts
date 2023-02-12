// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    100: "#ff3c00",
  },
};

const fonts = {
  body: `IBM Plex Sans, sans-serif`,
};

const styles = {
  global: () => ({
    body: {
      bg: "gray.200",
    },
  }),
};

const components = {
  // Button
};

export const theme = extendTheme({ colors, fonts, styles });
