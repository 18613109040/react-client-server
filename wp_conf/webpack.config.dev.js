var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var Clean = require("clean-webpack-plugin");

var rootDir = path.join(__dirname, "../");
var processName = process.env.NODE_ENV;

module.exports = {
  context: path.join(rootDir, "src"),
  entry:{
    app:"./app.js",
    lib: ["react", "react-dom", "react-router", "history", "react-redux", "js-cookie"]
    // vendors:['classnames', 'iso', 'react', 'react-dom', 'react-helmet', 'react-router', 'react-hot-loader']
  },
  output:{
    path: path.join(rootDir, "build"),
    filename: '[name].js',
    publicPath: "/"
  },
  module: {
    loaders: [
      { test: /\.js?x$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
      { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=1&name=assets/img/[sha512:hash:base64:7].[ext]' },
      { test: /\.json$/, loader:'file-loader?name=./[path][name].[ext]'}
    ]
  },
  plugins:[
    new Clean(['build'], rootDir),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"'+processName+'"'}),
    // new webpack.optimize.UglifyJsPlugin({warnings: false, minimize: true, sourceMap: false}),
    new ExtractTextPlugin("css/styles.css"), //提取CSS. http://npm.taobao.org/package/extract-text-webpack-plugin
    new CopyWebpackPlugin([
      {from :"../node_modules/antd/dist/antd.min.css", to: "../dist/css/antd.min.css"}
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/assets/index.html',
      host:'http://localhost:3080'
    })
  ]
};
