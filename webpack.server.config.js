var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
module.exports = {

  entry: path.resolve(__dirname, './server/server.js'),

  output: {
    path: __dirname,
    path: "server/chunkJs",
    filename: 'server.bundle.js',
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    // chunkFilename: '/statics/chunkJs/[name].server.[chunkhash:5].chunk.js',
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {}),

  node: {
    __filename: true,
    __dirname: true
  },

  resolve:{
    extensions:["",".js",".jsx","css","less","scss","png","jpg"],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/, exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
    ]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    // new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    // })
  ]

}
