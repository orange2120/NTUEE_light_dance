// const express = require('express')
// const webpack = require('webpack')
// const webpackDevMiddleware = require('webpack-dev-middleware')

// const webpackConfig = require('../webpack.config.js');

// const app = express()
// app.use(express.static('../asset'))

// if (process.env.NODE_ENV === 'development') {
//     // Setup Webpack for development
//     const compiler = webpack(webpackConfig)
//     app.use(webpackDevMiddleware(compiler, {
//         publicPath: webpackConfig.output.publicPath,
//     }))
//     app.use(webpackHotMiddleware(compiler))
// } else {
//     // Static serve the dist/ folder in production
//     app.use(express.static('dist'))
// }

// const port = 8080
// const server = app.listen(port);
// console.log(`Server listening on port ${port}`);
