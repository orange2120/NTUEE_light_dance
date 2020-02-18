import express from "express"

import path from "path"

import CmdServer from './CmdServer.js'
const fs = require('fs')


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
const CONFIG_PATH = './boards_config.json'
let CONFIG = ''
function readConfigFile(p=CONFIG_PATH){
    CONFIG = fs.readFileSync(p)
    CONFIG = JSON.parse(CONFIG)
}
function writeConfigFile(p=CONFIG_PATH){
    fs.writeFileSync(p,JSON.stringify(CONFIG))
}
readConfigFile()
let cmds = new CmdServer(8081,CONFIG)

server.get('/test', function(req, res) {
    res.send('hello world');
});

server.get('/api/getBoardsInfo', function(req, res) {
    res.json(cmds.getBoardsInfo())
    // res.send('hello world');
});

server.get('/api/getCurrentInfo', function(req, res) {
    res.json(cmds.getCurrentInfo())
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

server.get('/api/config/clear', function(req, res) {
    CONFIG.boards = []
    cmds.loadConfig(CONFIG)
    res.send('OK');
});

server.get('/api/config/addBoard', function(req, res) {
    console.log(req.query.mac)
    if(req.query.mac ==-1){
        res.send('no mac');
    }else{
        CONFIG.boards.push({
            "ip" : "",
            "mac" : req.query.mac
        })
        cmds.loadConfig(CONFIG)
        res.send('ok');
    }
    
});

server.get('/api/config/save', function(req, res) {
    writeConfigFile()
    res.send("OK")
});
server.get('/api/config/reload', function(req, res) {
    readConfigFile()
    cmds.loadConfig(CONFIG)
    res.send("OK")
});
