import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    keyframes: {
      breathing: {
        "0%, 100%": {
          boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.4)",
        },
        "50%": {
          boxShadow: "0 0 20px 0 rgba(255, 255, 255, 0.7)",
        },
      },
    },
    animation: {
      breathing: "breathing 2s ease-in-out infinite",
    },
  },
  plugins: [],
} satisfies Config;
