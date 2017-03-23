var path = require('path');

module.exports = {
  entry: {
    home: './components/containers/home.jsx',
    user: './components/containers/user.jsx',
    userAuth: './components/containers/userAuth.jsx',
    homeAuth: './components/containers/homeAuth.jsx',
    me: './components/containers/me.jsx'
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
