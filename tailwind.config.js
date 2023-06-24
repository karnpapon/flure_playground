/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: ["./dist/*.html"],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#585858"
      },
    },
  },
  plugins: [],
};
