/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        surface: "hsl(var(--surface))",
        "surface-secondary": "hsl(var(--surface-secondary))",
        "surface-tertiary": "hsl(var(--surface-tertiary))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
          soft: "hsl(var(--primary-soft))",
        },

        purple: {
          100: "hsl(var(--purple-100))",
          200: "hsl(var(--purple-200))",
          300: "hsl(var(--purple-300))",
          500: "hsl(var(--purple-500))",
          600: "hsl(var(--purple-600))",
        },

        green: {
          DEFAULT: "hsl(var(--green))",
          dark: "hsl(var(--green-dark))",
          light: "hsl(var(--green-light))",
          soft: "hsl(var(--green-soft))",
        },

        yellow: {
          DEFAULT: "hsl(var(--yellow))",
          dark: "hsl(var(--yellow-dark))",
          light: "hsl(var(--yellow-light))",
          soft: "hsl(var(--yellow-soft))",
        },

        orange: {
          DEFAULT: "hsl(var(--orange))",
          light: "hsl(var(--orange-light))",
        },

        blue: {
          DEFAULT: "hsl(var(--blue))",
          light: "hsl(var(--blue-light))",
        },

        red: {
          DEFAULT: "hsl(var(--red))",
          light: "hsl(var(--red-light))",
        },

        border: "hsl(var(--border))",
        muted: "hsl(var(--text-muted))",

        streak: "hsl(var(--streak))",
        xp: "hsl(var(--xp))",
      },

      fontFamily: {
        fredoka: ["Fredoka"],
        "fredoka-medium": ["FredokaMedium"],
        "fredoka-semibold": ["FredokaSemiBold"],
        "fredoka-bold": ["FredokaBold"],

        nunito: ["Nunito"],
        "nunito-medium": ["NunitoMedium"],
        "nunito-semibold": ["NunitoSemiBold"],
        "nunito-bold": ["NunitoBold"],
      },
    },
  },

  plugins: [],
};
