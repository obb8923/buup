//tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sb: 'Pretendard-SemiBold',
        r: 'Pretendard-Regular',
        m: 'Pretendard-Medium',
      },
      colors: {
        // 배경
        background1: "#000072", // 짙은 배경
        background2: "#0000a3", // 옅은 배경
        pattern: "#5750c5", // 배경에 무늬
        bubble: "#85DBDE", // 버블
        //
        white: "#fafafa", // 흰색
        black: "#121212", // 검은색
        red: "#FF3D3D", // 빨간색

        // Gray
        gray200: '#d1d1d1',
        gray700:"#525252",

      },
      padding: {
        px:'12px',
        pt:'20px',
      },
    },
  },
  plugins: [],
};
