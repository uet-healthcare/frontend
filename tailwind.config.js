const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    spacing: {
      0: "0px", // 0
      1: "1px", // px
      2: "2px", // 0.5
      4: "4px", // 1
      6: "6px", // 1
      8: "8px", // 2
      10: "10px", // 2
      12: "12px", // 3
      14: "14px", // 3
      16: "16px", // 4
      20: "20px", // 5
      24: "24px", // 6
      28: "28px", // 7
      32: "32px", // 8
      36: "36px", // 9
      40: "40px", // 10
      44: "44px", // 11
      48: "48px", // 12
      56: "56px", // 14
      64: "64px", // 16
      80: "80px", // 20
      96: "96px", // 24
      112: "112px", // 28
      128: "128px", // 32
      144: "144px", // 36
      160: "160px", // 40
      176: "176px", // 44
      192: "192px", // 48
      208: "208px", // 52
      224: "224px", // 56
      240: "240px", // 60
      256: "256px", // 64
      288: "288px", // 72
      320: "320px", // 80
      384: "384px", // 96
    },
    extend: {
      fontFamily: {
        // body: ["Mulish", ...defaultTheme.fontFamily.sans],
        logo: ["Philosopher", ...defaultTheme.fontFamily.sans],
        heading: ["Avenir Next Pro", ...defaultTheme.fontFamily.sans],
        body: ["Avenir Next", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // "x-my-pink": {
        //   100: "#f5ebe5",
        //   200: "#ead6cb",
        //   300: "#e0c2b2",
        //   400: "#d5ad98",
        //   500: "#cb997e",
        //   600: "#b8744f",
        //   700: "#8d5639",
        //   800: "#5e3926",
        //   900: "#2f1d13",
        // },
        // "x-bizarre": {
        //   400: "#f1e3db",
        //   500: "#cb997e",
        //   600: "#d3aa92",
        //   700: "#ba7952",
        //   800: "#804f33",
        //   900: "#20140d",
        // },
        // "x-serenade": "#fff1e6",
        // "x-cararra": "#f0efeb",
        // "x-cameo": "#ddbea9",
        // "x-tallow": {
        //   500: "#a5a58d",
        //   600: "#89896c",
        //   700: "#676751",
        //   800: "#444436",
        //   900: "#22221b",
        // },
        // "x-eagle": {
        //   300: "#d4d4c8",
        //   400: "#c5c5b6",
        //   500: "#b7b7a4",
        //   600: "#98987d",
        //   700: "#74745c",
        //   800: "#4d4d3d",
        //   900: "#27271f",
        // },
      },
    },
  },
  plugins: [],
};
