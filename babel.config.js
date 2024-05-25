module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo'
    ],
    plugins: [
      // Include reanimated last in plugin order
      'react-native-reanimated/plugin'
    ],
  };
};
