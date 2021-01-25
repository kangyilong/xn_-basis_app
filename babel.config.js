module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@pages': './src/pages',
          '@components': './src/components',
          '@methods': './src/methods',
          '@api': './src/api',
          '@redux': './src/redux',
        },
      },
    ],
  ],
};
