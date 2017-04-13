const path = require("path");
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Clean = require("clean-webpack-plugin");
const theme = require('../src/assets/theme');
const rootDir = path.join(__dirname, "../");
const NODE_MODULES = path.join(rootDir,"node_modules");
const PUBLIC_FOLDER = "dist";
const NPM_RUN_EVENT = process.env.npm_lifecycle_event;
const PROCESS_NAME = process.env.NODE_ENV;
const CLIENT = /(client)/; // 匹配是否是打包文件

const hotMiddlewareScript = 'webpack-hot-middleware/client?noInfo=false&quiet=false&reload=true';
const styleExtractor = new ExtractTextPlugin('css/styles.css',{allChunks:true});
const libExtractor = new ExtractTextPlugin('css/lib.css',{allChunks:true});

const commonConfig = {
  context: path.join(rootDir, "src"),
  entry: {
    lib: ["react", "react-dom", "react-router", "history", "react-redux", "js-cookie"]
  },
  output: {
    path: path.join(rootDir, PUBLIC_FOLDER), //必须是绝对地址
    filename: '[name].js',
    publicPath: "/",
    chunkFilename: '[name].chunk.js',
  },
  resolve:{
    extensions:["",".js",".jsx","css","less","scss","png","jpg"],
    alias:{
      'react-redux':path.join(NODE_MODULES,'react-redux/dist/react-redux.min.js'),
      'react-router':path.join(NODE_MODULES,'react-router/umd/ReactRouter.min.js'),
    }
  },
  module: {
    loaders: [
      {
        test   : /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader : "babel",
        query  : {
          plugins : [
            ['transform-runtime'], 
            ['import', [{libraryName: "antd", style: true}]],
          ],
          presets:[
            "es2015", "react", "stage-0"
          ],
          cacheDirectory: true
        }
      },
      {
        test  : /\.scss$/,
        loader: styleExtractor.extract('style', 'css!sass')
      },
      {
        test  : /\.less$/,
        loader: libExtractor.extract('style', `css!less?{"sourceMap":true,"modifyVars":${JSON.stringify(theme())}}`)
      },
      {
        test   : /\.css$/,
        exclude: /\.min.css$/,
        loader : styleExtractor.extract("style", "css")
      },
      {
        test  : /\.(jpe?g|png|gif|svg|woff|eot|ttf)$/,
        loader: `url?limit=1&name=img/[sha512:hash:base64:7].[ext]`
      },
      {
        test  : /\.json$/,
        loader: 'file?name=./[path][name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"' + PROCESS_NAME + '"'}),
    new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
    styleExtractor,
    libExtractor
  ]
};
const cleanConfig = {
  plugins: [
    new Clean([PUBLIC_FOLDER], rootDir),
  ]
};
const buildConfig = {
  entry: {
    app: ['babel-polyfill','./app'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({warnings: false, minimize: true, sourceMap: false})
  ]
};
const developmentConfig = {
	devtool: 'eval-source-map',
  entry: {
    app: ['webpack/hot/dev-server', hotMiddlewareScript,'babel-polyfill','./app']
  },
  plugins: [
    //Webpack 1.0
    new webpack.optimize.OccurenceOrderPlugin(),
    //Webpack 2.0 fixed this mispelling
    //new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

function mergeConfig() {
  let common = commonConfig;
  if(CLIENT.test(NPM_RUN_EVENT)){
    common = merge(common,cleanConfig);
  }
  switch (PROCESS_NAME) {
    case 'dev':
      return merge(
        common,
        developmentConfig
      );
      break;
    case 'stg':
    case 'production':
    default:
      console.log("【代码混淆】");
      return merge(
        common,
        buildConfig
      );
  }
}

module.exports = mergeConfig();
