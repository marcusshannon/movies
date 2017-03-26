var path = require('path');

module.exports = {
  entry: {
    app: './components/containers/app.jsx'
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
