const path = require('path');
const webpack = require('webpack');

const srcDir = path.resolve(__dirname, 'App');
const distDir = path.resolve(__dirname, 'assets/scripts');

module.exports = {
    context: srcDir,

    devtool: 'source-map',

    entry: {
        main : './main.ts'
    },
    output: {
        filename: 'Test.[name].bundle.js',
        path: distDir,
        publicPath: '/',
        library: ['Test', '[name]'],
        libraryTarget: 'umd',
        sourceMapFilename: 'Test.[name].map'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                include: /App/,
            }

        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            'name': 'vendor',
            minChunks(module, count) {
                var context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            },
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};