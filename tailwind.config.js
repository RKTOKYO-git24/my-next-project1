/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // App Router 用
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages Router 用（任意）
    "./components/**/*.{js,ts,jsx,tsx}" // コンポーネントを使用する場合
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
