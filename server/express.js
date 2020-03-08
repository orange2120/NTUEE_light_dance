// import express from "express"

// import path from "path"

// import CmdServer from './CmdServer.js'

// import CONTROL from '../data/control_test3.json'





const CmdServer = require('./CmdServer')

const path = require('path')

const express = require('express')
const fs = require('fs')

const os =require('os')


// const webpack = require('webpack')
// const webpack_config = require('../webpack.config')
// const compiler = webpack(webpack_config)

// const webpackDevMiddleware = require('webpack-dev-middleware')(
//     compiler,
//     webpack_config.devServer
// )
// const webpackHotMiddleware  = require('webpack-hot-middleware')(
//     compiler
// )
const staticMiddleware = express.static("editor/dist")
const server = express()
const PORT = 8080

let CONTROL= []

// server.use(webpackDevMiddleware)
// server.use(webpackHotMiddleware)
server.use(staticMiddleware)
server.use(express.json())

server.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})
const CONFIG_PATH = './boards_config.json'
let CONFIG = ''

function readConfigFile(p=CONFIG_PATH){
    if(!fs.existsSync(p)){
        // if file not exist create a emty config file
        CONFIG = {
            "boards": [],
            "settings": {
                "ping_interval": 3000,
                "server_mac_addr" : os.networkInterfaces()["en0"][0]["mac"]
            }
        }
        writeConfigFile()
    }else{
        CONFIG = fs.readFileSync(p)
        CONFIG = JSON.parse(CONFIG)
    }
    
}
function writeConfigFile(p=CONFIG_PATH){
    fs.writeFileSync(p,JSON.stringify(CONFIG))
}
readConfigFile()
let cmds = new CmdServer(8081,CONFIG)

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../editor/dist', 'index.html'));
})

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
    cmds.play(0,{
        targets:req.body.params.ids,
        time:req.body.params.time
    })
    console.log("[Server] play to ",req.body.params.ids)
    res.send('ok');
});

server.post('/api/pause', function(req, res) {
    cmds.pause(0,{targets:req.body.params.ids})
    console.log("[Server] pause to ",req.body.params.ids)
    res.send('ok');
});

server.get('/api/stop', function(req, res) {
    res.send('hello world');
});

server.get('/api/upload', function(req, res) {
    cmds.upload(0,{targets:req.query.ids.map((x)=>{ return Number(x)})},CONTROL)
    console.log("[Server] upload to ",req.query.ids)
    res.send('ok');
});

server.post('/api/upload', function(req, res) {
    
    cmds.upload(0,{
        targets : req.body.params.ids
    },req.body.params.control)
    console.log("[Server] upload new control to ",req.body.params.ids)
    res.send('ok');
});

server.get('/api/compile', function(req, res) {
    console.log("[Server] compile pngs")
    cmds.compile()
    // console.log("[Server] compile done")
    res.send('ok');
});


server.post('/api/reconnect', function(req, res) {
    // cmds.reConnectClient(0,{targets:req.query.ids.map((x)=>{ return Number(x)})})
    cmds.reConnectClient(0,{targets:req.body.params.ids})
    console.log("[Server] reconnect ",req.body.params.ids)
    res.send('ok');
    
});

server.post('/api/kick', function(req, res) {
    cmds.terminateBoard(req.body.params.ids)
    console.log("[Server] kick ",req.body.params.ids)
    res.send('ok');
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





server.get('/api/config/alert', function(req, res) {
    // req.query.mac
    res.send("OK")
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

cmds.compile()