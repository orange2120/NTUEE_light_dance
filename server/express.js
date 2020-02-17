import express from "express"

import path from "path"

import CmdServer from './CmdServer.js'



const webpack = require('webpack')
const webpack_config = require('../webpack.config')
const compiler = webpack(webpack_config)

const webpackDevMiddleware = require('webpack-dev-middleware')(
    compiler,
    webpack_config.devServer
)
const webpackHotMiddleware  = require('webpack-hot-middleware')(
    compiler
)
const staticMiddleware = express.static("server_static_src")
const server = express()
const PORT = 8080

server.use(webpackDevMiddleware)
server.use(webpackHotMiddleware)
server.use(staticMiddleware)

server.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})
const CONFIG = require('./config.json')
let cmds = new CmdServer(8081,CONFIG)

server.get('/test', function(req, res) {
    res.send('hello world');
});

server.get('/api/getBoardsInfo', function(req, res) {
    res.json(cmds.getBoardsInfo())
    // res.send('hello world');
});

server.post('/api/play', function(req, res) {
    res.send('hello world');
});

server.post('/api/pause', function(req, res) {
    res.send('hello world');
});

server.post('/api/stop', function(req, res) {
    res.send('hello world');
});

server.post('/api/upload', function(req, res) {
    res.send('hello world');
});

server.post('/api/reconnect', function(req, res) {
    res.send('hello world');
});

server.post('/api/kick', function(req, res) {
    req.params['id']
    res.send('hello world');
});