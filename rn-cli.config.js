const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  resolver: {
    blacklistRE: blacklist([/\/youi\/build\/.*/])
  },
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  }
};

