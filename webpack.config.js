var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/js');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    sourcePrefix: ''
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.json', '.jsx', '.js']
  },
  externals: {
    handlebars: 'require(\'handlebars\')',
    fs: 'require(\'fs\')',
    electron: 'require(\'electron\')'
  }
};

module.exports = config;
