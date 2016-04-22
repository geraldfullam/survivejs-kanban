const path      = require('path');
const webpack   = require('webpack');
const merge     = require('webpack-merge');
const stylelint = require('stylelint');
const cssnext   = require('postcss-cssnext');

const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;
const PATHS  = {
  src   : path.join(__dirname, 'src'),
  public: path.join(__dirname, 'public')
};
const ENV = {
  host: process.env.HOST || 'kanban.react.local',
  port: process.env.PORT || 8080
};

const common = {
  // Entry accepts a path or an object of entries. We'll be using the
  // latter form given it's convenient with more complex configurations.
  entry  : {
    src: PATHS.src
  },
  output : {
    path      : PATHS.public,
    publicPath: '/',
    filename  : 'bundle.js'
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
      }, {
        test   : /\.css$/,
        // Chained loaders apply right to left.
        loaders: ['style', 'css', 'postcss'],
        include: PATHS.src
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-map',
  postcss: function () {
    return {
      defaults: [ cssnext ],
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
      contentBase: PATHS.public,

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
    plugins  : [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}
