var path = require('path');

module.exports = {
  entry: {
    home: './home.jsx',
    user: './user.jsx'
  },
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  }
};
