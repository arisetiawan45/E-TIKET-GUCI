const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 1. Impor CopyPlugin
const CopyPlugin = require('copy-webpack-plugin'); 

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  
  devtool: 'inline-source-map',

  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Aplikasi Tiket Guci',
      template: './src/index.html' 
    }),
    // 2. Tambahkan CopyPlugin di sini
// SOLUSI: Gunakan path.resolve untuk memberikan path absolut yang jelas
  new CopyPlugin({
    patterns: [
      { from: path.resolve(__dirname, './src/assets'), to: 'assets' }
    ]
  })
  ],
  
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
};