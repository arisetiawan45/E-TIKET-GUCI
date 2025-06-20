const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import plugin

module.exports = {
  // Hapus 'mode' dari sini agar lebih fleksibel, biarkan dikontrol oleh skrip NPM
  // mode: 'development' 

  entry: './src/index.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  
  // Tambahkan devtool untuk debugging yang lebih baik
  devtool: 'inline-source-map', // Pilihan bagus untuk development

  devServer: {
    static: './dist',
    port: 3000,
    open: true, // Otomatis membuka browser
    hot: true,  // Mengaktifkan Hot Module Replacement
  },

  // Tambahkan array 'plugins' untuk HtmlWebpackPlugin
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack App', // Judul default untuk halaman HTML
      template: './src/index.html' // Path ke file template HTML Anda
    }),
  ],
  
  module: {
    rules: [
      // Loader untuk CSS (sudah ada)
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      // Tambahkan loader untuk JavaScript menggunakan Babel
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