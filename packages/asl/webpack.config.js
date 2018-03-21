const path = require('path');

module.exports = {
  entry: {
    places: './assets/js/pages/places.jsx'
  },
  output: {
    path: path.resolve(__dirname, './public/js/pages')
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module : {
    rules : [
      {
        test : /\.jsx?/,
        exclude: /node_modules/,
        loader : 'babel-loader'
      }
    ]
  }
};
