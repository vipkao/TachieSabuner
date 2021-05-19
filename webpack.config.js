'use strict';
process.traceDeprecation = true;

var webpack = require('webpack');
module.exports = {
    mode: 'development',
    entry: {
        'app.bundle': './src/TachieSabuner.js',
    },
    output: {
        path: __dirname + "/docs",
        filename: "[name].js",
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, }
        ]
    },
    optimization: {
        splitChunks: {
          name: 'vender.bundle',
          chunks: 'initial',
        }
      },
    cache: true,
};
