/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",    
  ],
  theme: {
    extend: {
      colors: {
        eggblue: "#14B2A2",
        slategray: "#283F41",
        aquamarine: "#95FDF8",
        cheeseyellow: "#EFB53A",
        brightaqua: "#00FFE9",

        mint: "#A4EFE9",
        neonblue: "#08E8DE",
        timbergreen: "#1E2C2D",
        riverbed: "#384B54",
        greenpea: "#19564B",
        pinegreen: "#0E8573"
      },
      fontFamily: {
        montserrat: "Montserrat",
        poppins: "Poppins",
      },
      keyFrames: {
        wiggle: {
          '25%': {
            transform: 'translateX(10px)',
            color: 'blue'
          },
          '50%': {
            transform: 'translateX(0px)',
            color: 'yellow'
          },
          '100%': {
            transform: 'translateX(-10px)',
            color: 'red'
          }
        }
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-out infinite'
      },      
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-gradient": (angle) => ({
            "background-image": `linear-gradient(${angle}, var(--tw-gradient-stops))`,
          }),
        },
        {
          values: Object.assign(theme("bgGradientDeg", {}), {
            10: "10deg",
            15: "15deg",
            20: "20deg",
            25: "25deg",
            30: "30deg",
            45: "45deg",
            60: "60deg",
            90: "90deg",
            120: "120deg",
            135: "135deg",
          }),
        }
      );
    }),
  ],
};
