/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["retro", "dracula"],
    darkTheme: false,
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    logs: true,
  },
}