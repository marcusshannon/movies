var path = require('path');

module.exports = {
  entry: './index.jsx',
  output: {
    filename: 'bundle.js',
    // path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  },
  externals : {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
