var path = require('path');

module.exports = {
  entry: {
    home: './containers/home.jsx',
    user: './containers/user.jsx',
    userAuth: './containers/userAuth.jsx',
    homeAuth: './containers/homeAuth.jsx',
    me: './containers/me.jsx'
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
