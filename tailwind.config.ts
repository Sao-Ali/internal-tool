import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // optional
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // if you use /src
  ],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
