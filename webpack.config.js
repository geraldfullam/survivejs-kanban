const path      = require('path');
const webpack   = require('webpack');
const merge     = require('webpack-merge');
const stylelint = require('stylelint');
const cssnext   = require('postcss-cssnext');


const CleanPlugin       = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin  = require('npm-install-webpack-plugin');

// Load *package.json* so we can use `dependencies` from there
const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS  = {
  src   : path.join(__dirname, 'src'),
  public: path.join(__dirname, 'public'),
  style : path.join(__dirname, 'src/main.css')
};
const ENV    = {
  host: process.env.HOST || 'kanban.react.local',
  port: process.env.PORT || 8080
};

const common = {
  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given it's convenient with more complex configurations.
  entry  : {
    src  : PATHS.src,
    style: PATHS.style
  },
  output : {
    path      : PATHS.public,
    publicPath: '/',
    filename  : '[name].js'
  },
  module : {
    preLoaders: [
      {
        test   : /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.src
      }, {
        test   : /\.css$/,
        loader : 'postcss?pack=lint',
        include: PATHS.src
      }
    ],
    loaders   : [
      {
        // Expects a RegExp (note the slashes).
        test   : /\.jsx?$/,
        // Accepts `!` separated list for optional chaining
        loader : 'babel',
        // Accepts either a path or an array of paths.
        include: PATHS.src
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template  : 'node_modules/html-webpack-template/index.ejs',
      title     : 'Kanban app',
      appMountId: 'app',
      inject    : false
    })
  ],
  devtool: 'source-map',
  postcss: function () {
    return {
      defaults: [cssnext],
      lint    : [
        stylelint({
          rules: {
            'color-hex-case': 'lower'
          }
        })
      ]
    }
  }
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devServer: {

      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,
      hot               : true,
      inline            : true,
      progress          : true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // parse host and port from env so this is easy
      // to customize
      host: ENV.host,
      port: ENV.port
    },
    module   : {
      loaders: [
        // Define development specific CSS setup
        {
          test   : /\.css$/,
          loaders: ['style', 'css', 'postcss'],
          include: PATHS.src
        }
      ]
    },
    plugins  : [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    // Define vendor entry point needed for splitting
    entry  : {
      vendor: Object.keys(pkg.dependencies).filter(function (v) {
        // Exclude alt-utils as it won't work with this setup
        // due to the way the package has been designed
        // (no package.json main).
        return v !== 'alt-utils';
      })
    },
    output : {
      path         : PATHS.public,
      filename     : '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    module : {
      loaders: [
        // Extract CSS during build
        {
          test   : /\.css$/,
          loader : ExtractTextPlugin.extract('style', 'css!postcss'),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new CleanPlugin([PATHS.public]),
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css'),
      // Setting DefinePlugin affects React library size!
      // DefinePlugin replaces content "as is" so we need some extra quotes
      // for the generated code to make sense
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'

        // You can set this to JSON.stringify('development') for your
        // development target to force NODE_ENV to development mode
        // no matter what
      }),
      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
