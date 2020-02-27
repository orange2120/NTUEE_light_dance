
const fs = require('fs')
const WebSocket = require('ws')
const os = require('os');

const libarp = require('arp');

class CmdServer
{
    constructor(_port=8081,_config){
        
        this.wss = new WebSocket.Server({ port: _port })
        // this.wss.waitingList = []
        this.config = -1
        this.loadConfig(_config)
        this.server_ip = this.getLocalIp()
        // this.BOARDS=[]
        
        this.wss.on('connection', this.processConnection);
        
        this.initInterval()
    }
    startServer(){

    }
    loadConfig(_config){
        if(this.config !=-1){
            this.wss.clients.forEach((client) => {
            
                if(client.readyState === WebSocket.OPEN) {
                    
                    // this.sendToBoards("{}",[client.board_ID])
                    
                    console.log(`[Server] Kick Board(${client.board_ID}) at ${client.ipAddr} for reload config`)
                    client.terminate()
                        // console.log(`[Server] Kick Board(${client.board_ID}) at ${client.ipAddr}`)
                    
                    
                }
            });
        }

        this.config = _config
        this.wss.BOARDS = this.config.boards.map(obj => { 
            obj.status = "disconnect"
            return obj
        })
        
        for (let i=0;i<this.wss.BOARDS.length;++i)
        {
            this.wss.BOARDS[i].id=i;
        }
        

    }
    getLocalIp(){
        let ifaces = os.networkInterfaces();

        let ipp = "error"
        
        Object.keys(ifaces).forEach(function (ifname) {
          let alias = 0;
        
          ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
              // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
              return;
            }
        
            if (alias >= 1) {
              // this single interface has multiple ipv4 addresses
            //   console.log(ifname + ':' + alias, iface.address);
              ipp = iface.address;
            } else {
              // this interface has only one ipv4 adress
            //   console.log(ifname, iface.address);
              ipp = iface.address;
            //   break;
            }
            ++alias;
          });
        }); 
        return ipp
    }
    printServerSats(){
        console.log('[Server Status]')
        console.log('Server local ip: ' + String(this.server_ip))
        console.log('Boards')
        for (let i=0;i<this.wss.BOARDS.length;++i)
        {
            console.log(' (' + String(this.wss.BOARDS[i].id) + ') ' + String(this.wss.BOARDS[i].ip) + ' ' + String(this.wss.BOARDS[i].status))
        }
        // console.log(this)
        console.log('')
    }
    getBoardsInfo(){
        return this.wss.BOARDS
    }
    getCurrentInfo(){
        let ret = {
            boards : this.wss.BOARDS,
            waitingList : []
        }
        // console.log(this.wss.clients)
        this.wss.clients.forEach((client)=>{
            if (client.board_ID==-1) {
                ret.waitingList.push({ 
                    mac: client.macAddr , 
                    ip: client.ipAddr, 
                    board_type : client.board_type
                })
            }
        })
        return ret
            
        
    }
    terminateBoard(_id=[]){
        // if id=[] : only remove board that is not alive
        // console.log("[Server] kick boards")
        this.wss.clients.forEach((client) => {
            // if(client.isAlive == false){
            //     client.terminate()
            //     this.wss.BOARDS[client.board_ID].status = "disconnect"
            //     console.log(`[Server] Board remove upexpectedly (${client.board_ID}) at ${client.ipAddr}`)
                
            // }else 
            if(client.readyState === WebSocket.OPEN &&  _id.includes(client.board_ID)) {
                
                // this.sendToBoards("{}",[client.board_ID])
                client.send(JSON.stringify({
                    type:"safe_kick"
                }),()=>{
                    // this.wss.BOARDS[client.board_ID].status = "disconnect"
                    // client.terminate()
                    console.log(`[Server] Kick Board(${client.board_ID}) at ${client.ipAddr}`)
                })
                
            }
        });
        // console.log("[Server] done")
        console.log('')
    }
    processConnection(ws, req)
    {
        ws.board_ID = -1
        ws.ipAddr = ""
        ws.isAlive = true;

        ws.transmit_delay = -1

        function heartbeat(x) {
            this.isAlive = true;
            let obj = JSON.parse(String(x))
            
            // console.log((Date.now() - obj.server_time)/2)
            this.transmit_delay = (Date.now() - obj.server_time)/2
        }
        ws.on('pong', heartbeat);
        // console.log('jj')
        // console.log(this)
        const ip = req.connection.remoteAddress.split(":")[3];
        ws.ipAddr = ip
        ws.macAddr = -1
        let server_self = this
        ws.on('message', message => {
            let response_msg ={
                type :  "empty"
            }
            // ws.send(JSON.stringify(response_msg))
            console.log('') 
            console.log(`[Client] ${ip} : ${message}`)
            message = JSON.parse(message)
            if (message.type === "request_to_join")
            {
                
                // new board request to join
                let self = this
                libarp.getMAC(ip, function(err, mac) {
                    // assert.ok(!err);
                    // assert.ok(mac != null);
                    let regex = /^((([a-fA-F0-9][a-fA-F0-9]+[-]){5}|([a-fA-F0-9][a-fA-F0-9]+[:]){5})([a-fA-F0-9][a-fA-F0-9])$)|(^([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]+[.]){2}([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]))$/ 
                    if(mac == null)
                    {
                        
                        console.log(`[Server] Cannot find corressponding Mac Address of ${ip}`)
                        ws.terminate()
                        return
                    }else if(regex.test(mac) == false){
                        console.log(`[Server] Cannot find corressponding Mac Address of ${ip}`)
                        // ws.terminate()
                        return
                    }
                    ws.macAddr = mac
                    console.log(`[Server] Client Mac:${mac}`);
                    ws.board_type = message.data.board_type


                    let find_board =  self.BOARDS.filter(obj => {
                        return obj.mac === String(mac)
                    })
                    // let find_board = self.getBoardByIP(ip)
                    if(find_board.length===0){
                        // the board's ip is not regestered
                        console.log(`[Server] Board(${mac}) not registered`)
                        // ws.terminate()
                        return
                    }
                    console.log(`[Server] Adding Board: ip = ${ip} mac = ${mac} id = ${find_board[0].id}`);
                    response_msg.type = "ACKs"
                    response_msg.data = {ack_type : "request_to_join" , board_id : find_board[0].id}
                    ws.send(JSON.stringify(response_msg))
                    find_board[0].status = "connected"
                    find_board[0].ip = ip
                    find_board[0].board_type = message.data.board_type
                    ws.board_ID = find_board[0].id
                    ws.ipAddr = ip
                    ws.macAddr = mac
                    
                    console.log("[Server] ACKs sent")

                });


                // console.log(this.BOARDS)
            }
        });
        // ws.send('Hello! Message From Server!!')
        ws.on('close',function s(){
            if(ws.board_ID!=-1)
            {
                // console.log(server_self.BOARDS[ws.board_ID])
                if(server_self.BOARDS[ws.board_ID]!= undefined){
                    server_self.BOARDS[ws.board_ID].status = "disconnect"
                }
                
            }
            console.log(`[Client] (${ws.board_ID}) ${ws.ipAddr} ${ws.macAddr} leave`)
        })
    }
    sendToBoards(msg,targets){
        this.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && targets.includes(client.board_ID)) {
                // let boardMsg = {
                //     type: 'upload',
                //     data: CONTROL[client.board_ID] //boardData[client.boardId]
                //     // wsdata: wsData[client.boardId]
                // };
                client.send(JSON.stringify(msg));
            }
        });
    }
    initInterval(){
        // function noop() {}
        let self = this
        const interval = setInterval(function ping() {
            self.wss.clients.forEach(function each(client) {
                // checking board if still connected
                // console.log("checking id=" + String(ws.board_ID))
              if (client.isAlive === false)
              {
                // self.terminateBoard()
                client.terminate()
                if(client.board_ID!=-1)
                {
                    // self.wss.BOARDS[client.board_ID].status = "disconnect"
                    console.log(`[Server] Board(registered) remove upexpectedly (${client.board_ID}) at ${client.ipAddr}`)
                }else{
                    console.log(`[Server] Board(Not registered) remove upexpectedly at ${client.ipAddr}`)
                }
                return //ws.terminate();
              } 
              
              client.isAlive = false;
            //   send server time and connection delay time
            client.ping(JSON.stringify(
                  {
                      server_time : Date.now(),
                      delay : client.transmit_delay
                  }),{},true);
            //   ws.ping(noop);
            });
        }, this.config.settings.ping_interval);
    }
    async getBoardByIP(_ip){
        let find_board = await this.BOARDS.filter(obj => {
            return obj.ip === String(_ip)
        })
        return find_board
    }

    play(cmd_start_time,params){
        let msg={
            type: "play",
            data : {
                start_at_server : cmd_start_time,
                play_from_time : params.time
            }
        }
        this.sendToBoards(msg,params.targets)
    }
    pause(cmd_start_time,params){
        let msg={
            type: "pause",
            data : {
                start_at_server : cmd_start_time
            }
        }
        this.sendToBoards(msg,params.targets)
    }
    upload(cmd_start_time,params,control){
        this.wss.clients.forEach((client) => { 
            if(client.readyState === WebSocket.OPEN && params.targets.includes(client.board_ID)) {
                console.log("upload",client.board_ID)
                let boardMsg = {
                    type: 'upload',
                    data: control[client.board_ID] //boardData[client.boardId]
                    // wsdata: wsData[client.boardId]
                };
                client.send(JSON.stringify(boardMsg));
            }
        });
    }
    rebootBoard(cmd_start_time,params){
        let msg = {
            type:"rebootBoard"
        }
        this.sendToBoards(msg,params.targets)
    }
    runTest(cmd_start_time,params){
        let msg = {
            type:"runTest"
        }
        this.sendToBoards(msg,params.targets)
    }
    reConnectClient(cmd_start_time,params){
        let msg = {
            type:"reConnectClient"
        }
        this.sendToBoards(msg,params.targets)
    }
}
// export default CmdServer
module.exports = CmdServer
/*
const CONFIG = require('./config.json')
const CONTROL = require('../data/control_test2.json')

let s = new CmdServer(8081,CONFIG)
// s.printServerSats()

// for CLI and command parser
let readline = require('readline');
let rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('lighdance_cmd> ');
rl.prompt();
rl.on('line', function(line) {
    // if (line === "right") rl.close();
    // rl.prompt();
    need_send_msg = false
    line = line.split(' ')
    if(line.length<1){
        rl.prompt();
        return
    }
    if(line[0].toLowerCase()=="status")
    {
        s.printServerSats()
    }
    else if(line[0].toLowerCase()=="kick")
    {
        if(line.length<2 ){
            console.log("[Server] kick all boards")
            let li = []
            for (i=0;i<s.wss.BOARDS.length;++i)
            {
                li.push(i)
            }
            s.terminateBoard(li)
        }else if(line[1].toLowerCase()==="all")
        {
            console.log("[Server] kick all boards")
            let li = []
            for (i=0;i<s.wss.BOARDS.length;++i)
            {
                li.push(i)
            }
            s.terminateBoard(li)
        }else{
            console.log("[Server] kick boards")
            let li = line.slice(1,)
            li = li.map(function (x) { 
                return parseInt(x, 10); 
            });
            s.terminateBoard(li)
        }

        
        console.log("[Server] done")
    }
    else if(line[0].toLowerCase()=="upload"){
        console.log("[Server] upload all boards")
        s.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && client.board_ID > -1) {
                let boardMsg = {
                    type: 'upload',
                    data: CONTROL[client.board_ID] //boardData[client.boardId]
                    // wsdata: wsData[client.boardId]
                };
                client.send(JSON.stringify(boardMsg));
            }
        });
        console.log("[Server] upload done\n")
    }
    else if(line[0].toLowerCase()=="help")
    {
        console.log("\n[Help]")
        console.log("upload (id list) : upload data to board(s)")
        console.log("kick (id list) : kick board\n")
    }
    else if(line[0].toLowerCase()=="play")
    {
        s.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && client.borad_ID > -1) {
                let boardMsg = {
                    type: 'play'
                    // data: CONTROL[client.borad_ID] //boardData[client.boardId]
                    // wsdata: wsData[client.boardId]
                };
                client.send(JSON.stringify(boardMsg));
            }
        });
        console.log("[Server] Done")
    }
    else if(line[0].toLowerCase()=="abort")
    {
        s.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && client.borad_ID > -1) {
                let boardMsg = {
                    type: 'abort'
                    // data: CONTROL[client.borad_ID] //boardData[client.boardId]
                    // wsdata: wsData[client.boardId]
                };
                client.send(JSON.stringify(boardMsg));
            }
        });
        console.log("[Server] Done")
    }
    else if(line[0]!="")
    {
        console.log(`Command not found ${line[0]}`)
    }
    rl.prompt()
}).on('close',function(){
    process.exit(0);
});
 */