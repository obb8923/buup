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
        gray600: '#6b6b6b',
        gray700:"#525252",

        // Red
        red500: '#FF0A0A',
        red700: '#A30000',

         //block
        blockWhite:"#ececd1",
        blockBlack:"#14151f",
        blockBlue:"#063E7B",
        blockOrange:"#F19648",
        blockRed:"#F55A3C",
        blockYellow:"#F5D259"
      },
      padding: {
        px:'12px',
        pt:'20px',
      },
    },
  },
  plugins: [],
};
