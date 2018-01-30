import { LoaderOptionsPlugin } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = {
  entry: {
    'app': './resources/assets/scripts/app.js',
    'main': './resources/assets/styles/main.scss',
    'amp.about': './resources/assets/styles/amp/about.scss',
  },
  output: {
    filename: './public/static/js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css-loader',
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './public/static/css/[name].css',
    }),
    new CopyWebpackPlugin([
      {
        from: './resources/assets/images',
        to: './public/static/images'
      },
    ]),
  ],
  devtool: 'source-map',
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new LoaderOptionsPlugin({minimize: true}));
  config.plugins.push(new UglifyJsPlugin());
}

module.exports = config;
