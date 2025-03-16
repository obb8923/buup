//babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      ["transform-remove-console", { exclude: [] }] // 모든 console 제거
    ],
  };
};
