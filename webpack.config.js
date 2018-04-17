var webpack = require('webpack');
var path = require('path');
//var CompressionPlugin = require("compression-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var isProd = (process.env.NODE_ENV === 'production');


module.exports = {
  entry: {
    'keep-warm/index': './keep-warm/index.js',
    'main/index': './main/index.js'
  }, 
  target: 'node',
  output: {
    path: path.join(__dirname, "build"),
    filename: '[name].js',
    libraryTarget: "commonjs2"
  },
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [ 
      { test: /rx\.lite\.aggregates\.js/, use: 'imports-loader?define=>false' },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: getPlugins()
}


function getPlugins() {
  var plugins = [];

  // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
  // inside your code for any environment checks; UglifyJS will automatically
  // drop any unreachable code.
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }));

  //plugins.push(new webpack.IgnorePlugin(/^(buffertools)$/));

  // Conditionally add plugins for Production builds.
  if (isProd) {
    plugins.push(
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: false,
          warnings: false,
          mangle: false,
          compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true
          },
          output: {
            comments: false,
          },
          exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }
      })
    );
  }

  // Conditionally add plugins for Development
  else {
    // ...
  }

  return plugins;
}
