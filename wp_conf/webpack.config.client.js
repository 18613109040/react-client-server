var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var Clean = require("clean-webpack-plugin");

var rootDir = path.join(__dirname, "../");
var processName = process.env.NODE_ENV;

var styleExtractor = new ExtractTextPlugin('css/styles.css');
var antdExtractor = new ExtractTextPlugin('css/antd.min.css');

var config = {
  context: path.join(rootDir, "src"),
  entry:{
    app:'./app.js',
    lib: ["react", "react-dom", "react-router", "history", "react-redux", "js-cookie"]
  },
  output:{
    path: path.join(rootDir, "dist"),
    filename: '[name].js',
    publicPath: "/"
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.less$/, loader: antdExtractor.extract('style','css!less') },
      { test: /\.scss$/, loader: styleExtractor.extract('style','css!sass') },
      { test: /\.css$/, exclude: /\.min.css$/, loader: styleExtractor.extract("style", "css") },
      { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=1&name=assets/img/[sha512:hash:base64:7].[ext]' },
      { test: /\.json$/, loader:'file-loader?name=./[path][name].[ext]'}
    ]
  },
  plugins:[
    new Clean(['dist'], rootDir),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"'+processName+'"'}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
    styleExtractor,
    antdExtractor,
    //new ExtractTextPlugin("css/styles.css"), //提取CSS. http://npm.taobao.org/package/extract-text-webpack-plugin
    new webpack.optimize.UglifyJsPlugin({warnings: false, minimize: true, sourceMap: false}),
    //new CopyWebpackPlugin([
    //  {from :"./assets/antd_style/antd-custom.min.css", to: "../dist/css/antd.min.css"}
    //]),
    //new HtmlWebpackPlugin({
    //  filename: 'index.html',
    //  template: './assets/index.html',
    //  host:'http://localhost:3080'
    //})
  ]
};

module.exports = config;
