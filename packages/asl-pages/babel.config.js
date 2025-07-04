const config = require('@asl/service/.babelrc.json');

module.exports = {
  ...config,
  presets: [
    '@babel/preset-env', // Transpile modern JavaScript
    '@babel/preset-react' // Transpile React JSX
  ]};
