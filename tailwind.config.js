/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,md}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Meiryo',
          'メイリオ',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}
