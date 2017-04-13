var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var Clean = require("clean-webpack-plugin");

var rootDir = path.join(__dirname, "..");
var processName = process.env.NODE_ENV;


var styleExtractor = new ExtractTextPlugin('css/styles.css');
var antdExtractor = new ExtractTextPlugin('css/antd.min.css');

var config = {
  context: path.join(rootDir, "src"),
  devtool: 'eval-source-map',
  entry:{
    app: [
    'webpack-hot-middleware/client?noInfo=false&quiet=false&reload=true',
    './app.js'],
    lib: ["react", "react-dom", "react-router", "history", "react-redux", "js-cookie"]
  },
  output:{
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    // publicPath: '/assets/'
    // path: path.join(rootDir, "build"),
    // filename: '[name].js',
    publicPath: "/"
  },
  
  
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.less$/, loader: antdExtractor.extract('style','css!less') },
      { test: /\.scss$/, loader: styleExtractor.extract('style','css!sass') },
      { test: /\.css$/, loader: styleExtractor.extract('style','css') },
      { test: /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/, loader: 'url?limit=100&name=assets/img/[sha512:hash:base64:7].[ext]' },
      { test: /\.json$/, loader:'file-loader?name=./[path][name].[ext]'}
    ]
  },
  externals: {
   // 'react': 'React',
    //'react-dom': 'ReactDOM' 
  },
  plugins:[
    //new Clean(['dist/index.html'], rootDir),
    
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    styleExtractor,
    antdExtractor,
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"'+processName+'"'}),
    // new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
    // new webpack.optimize.UglifyJsPlugin({warnings: false, minimize: true, sourceMap: false}),
    //new ExtractTextPlugin("css/styles.css"), //提取CSS. http://npm.taobao.org/package/extract-text-webpack-plugin
    //new CopyWebpackPlugin([
    //  {from :"./assets/antd_style/antd-custom.min.css", to: "../dist/css/antd.min.css"}
    //])
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'assets/index.html',
    //   host:'http://localhost:3081'
    // })
  ]
};

module.exports = config;
