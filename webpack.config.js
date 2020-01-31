const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        index: './editor/js/index.js'
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'editor/dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: '#eval-source-map', // for develop
    devServer: {
        stats: {
            children: false, // cleaner display on terminal
            maxModules: 0 // cleaner display on terminal
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'editor/html/index.html'
        })
    ]
}