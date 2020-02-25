// import express from "express"

// import path from "path"

// import CmdServer from './CmdServer.js'

// import CONTROL from '../data/control_test3.json'

// temp
const CONTROL=[
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}],
    [{"Start": 0,
    "Status": {
        "HAT1": 0, "HAT2": 0, "FACE1": 0, "FACE2": 0, "INNER1": 0, "INNER2": 0, "L_COAT1": 0, "L_COAT2": 0, "R_COAT1": 0, "R_COAT2": 0,
    "L_ARM1": 0, "L_ARM2": 0, "R_ARM1": 0, "R_ARM2": 0, "L_HAND": 0, "R_HAND": 0, "L_PANTS1": 0, "L_PANTS2": 0, "R_PANTS1": 0,
    "R_PANTS2": 0, "L_SHOES1": 0, "L_SHOES2": 0, "R_SHOES1": 0, "R_SHOES2": 0        
    }}]
]


const CmdServer = require('./CmdServer')

const path = require('path')

const express = require('express')
const fs = require('fs')


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

// server.use(webpackDevMiddleware)
// server.use(webpackHotMiddleware)
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

server.get('/api/play', function(req, res) {
    cmds.play(0,{targets:req.query.ids.map((x)=>{ return Number(x)})})
    console.log("[Server] play to ",req.query.ids)
    res.send('ok');
});

server.get('/api/pause', function(req, res) {
    cmds.pause(0,{targets:req.query.ids.map((x)=>{ return Number(x)})})
    console.log("[Server] pause to ",req.query.ids)
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

server.get('/api/reconnect', function(req, res) {
    cmds.reConnectClient(0,{targets:req.query.ids.map((x)=>{ return Number(x)})})
    console.log("[Server] reconnect ",req.query.ids)
    res.send('ok');
    
});

server.get('/api/kick', function(req, res) {
    cmds.terminateBoard(req.query.ids.map((x)=>{ return Number(x)}))
    console.log("[Server] kick ",req.query.ids)
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
