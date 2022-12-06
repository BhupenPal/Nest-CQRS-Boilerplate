// const nodeExternals = require('webpack-node-externals');
// const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

// module.exports = function (options, webpack) {
//   return {
//     ...options,
//     entry: ['webpack/hot/poll?100', options.entry],
//     externals: [
//       nodeExternals({
//         allowlist: ['webpack/hot/poll?100'],
//       }),
//     ],
//     plugins: [
//       ...options.plugins,
//       new webpack.HotModuleReplacementPlugin(),
//       new webpack.WatchIgnorePlugin({
//         paths: [/\.js$/, /\.d\.ts$/],
//       }),
//       new RunScriptWebpackPlugin({
//         name: options.output.filename,
//         autoRestart: false,
//       }),
//     ],
//   };
// };

// const webpack = require('webpack');
// const path = require('path');
// const nodeExternals = require('webpack-node-externals');
// // const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const isProduction =
//   typeof process.env.NODE_ENV !== 'undefined' &&
//   process.env.NODE_ENV === 'production';
// const mode = isProduction ? 'production' : 'development';
// const devtool = isProduction ? false : 'inline-source-map';
// module.exports = {
//   entry: ['webpack/hot/poll?100', './src/main.ts'],
//   optimization: {
//     minimize: false,
//   },
//   target: 'node',
//   mode,
//   devtool,
//   externals: [
//     nodeExternals({
//       whitelist: ['webpack/hot/poll?100'],
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         loader: 'ts-loader',
//         options: {
//           transpileOnly: true,
//         },
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['.tsx', '.ts', '.js'],
//   },
//   plugins: [
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
//     // new ForkTsCheckerWebpackPlugin({
//     //   tslint: true,
//     // }),
//     // new webpack.DefinePlugin({
//     //   CONFIG: JSON.stringify(require('config')),
//     // }),
//   ],
//   output: {
//     path: path.join(__dirname, 'dist'),
//     filename: 'server.js',
//   },
// };

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const WebPackIgnorePlugin = {
  checkResource: function (resource) {
    const lazyImports = [
      '@nestjs/microservices',
      '@nestjs/microservices/microservices-module',
      'cache-manager',
      'class-transformer',
      'class-validator',
      'fastify-static',
    ];

    if (!lazyImports.includes(resource)) return false;

    try {
      require.resolve(resource);
    } catch (err) {
      return true;
    }

    return false;
  },
};

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    server: './src/main.ts',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  node: {
    __dirname: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin(WebPackIgnorePlugin),
  ],
  optimization: {
    minimize: false,
  },
  performance: {
    maxEntrypointSize: 1000000000,
    maxAssetSize: 1000000000,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'prod'),
  },
};
