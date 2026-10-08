import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        ink: "var(--color-ink)",
        text: "var(--color-ink)",
        muted: "var(--color-muted)",
        line: "var(--color-line)",
        accent: {
          DEFAULT: "var(--color-accent)",
          glow: "var(--color-accent-glow)",
        },
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        heading: ["'Syne'", "sans-serif"],
        body: ["'Instrument Sans'", "sans-serif"],
      },
      letterSpacing: {
        heading: "-0.04em",
      },
      lineHeight: {
        heading: "0.9",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
