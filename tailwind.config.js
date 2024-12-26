/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./assets/js/**/*.js", "./*.html","./assets/html/**/*.html"],
  theme: {
    extend: {
      colors: {
        goldenrod: "#D19D0E",
        lightGray: "#E9ECEF",
        darkGolden: "#B8860B",
        ivory: "#F8F9FA",
        brightYellow: "#F9C415",
        deepBlack: "#0C0B0B",
        darkBrown: "#946C09",
        navy: "#2A3B52",
        mustard: "#E6B012",
        darkBlueGray: "#1E2B3C",
        charcoal: "#363534",
        slateBlue: "#425B7E",
        darkSlate: "#282726",
        gray: "#CED4DA",
        steelBlue: "#364B68",
        silver: "#DEE2E6",
        midnight: "#121B26",
        onyx: "#1A1918",
        button_divs_background: "#FBD65C",
        gray_used_in_small_text: "#BCBCBC",
        gray_used_in_divider_lines: "#B3B3B3",
        blue_shadow_in_pop_up: "#425B7E",
      },
      fontFamily: {
        montaga: ["Montaga", "serif"],
        inria: ["Inria Serif", "serif"],
      },
      screens:{
        "503":"503px",
        "442":"442px"
      },
    },
  },
  plugins: [],
};
