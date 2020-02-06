
const fs = require('fs')
const WebSocket = require('ws')
const os = require('os');



class CmdServer
{
    constructor(_port=8081,_config){
        
        this.wss = new WebSocket.Server({ port: _port })
        this.loadConfig(_config)
        this.server_ip = this.getLocalIp()
        // this.BOARDS=[]
        
        this.wss.on('connection', this.processConnection);
    }
    loadConfig(_config){
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
    terminateBoard(_id){
        console.log("[Server] kick boards")
        this.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN &&  _id.includes(client.borad_ID)) {
                
                this.wss.BOARDS[client.borad_ID].status = "disconnected"
                client.terminate()
                console.log(`[Server] Kick Board(${client.borad_ID}) at ${client.ipAddr}`)
            }
        });
        console.log("[Server] done")
        console.log('')
    }
    processConnection(ws, req)
    {
        ws.borad_ID = -1
        ws.ipAddr = ""
        // console.log('jj')
        // console.log(this)
        const ip = req.connection.remoteAddress.split(":")[3];
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
                // console.log(this.BOARDS)

                let find_board =  this.BOARDS.filter(obj => {
                    return obj.ip === String(ip)
                })
                // let find_board = self.getBoardByIP(ip)
                if(find_board.length===0){
                    // the board's ip is not regestered
                    console.log(`[Server] Board(${ip}) not registered`)
                    ws.terminate()
                    return
                }
                console.log("[Server] Adding Board: ip=",ip," id=" ,find_board[0].id);
                response_msg.type = "ACKs"
                response_msg.data = "request_to_join"
                ws.send(JSON.stringify(response_msg))
                find_board[0].status = "connected"
                ws.borad_ID = find_board[0].id
                ws.ipAddr = ip
                console.log("[Server] ACKs sent")
                // console.log(this.BOARDS)
            }
        });
        // ws.send('Hello! Message From Server!!')
        ws.on('close',function s(){
            if(ws.borad_ID!=-1)
            {
                server_self.BOARDS[ws.borad_ID].status = "disconnected"
            }
            console.log(`[Client] (${ws.borad_ID}) ${ip} leave`)
        })
    }
    sendToBoards(){

    }
    async getBoardByIP(_ip){
        let find_board = await this.BOARDS.filter(obj => {
            return obj.ip === String(_ip)
        })
        return find_board
    }
}
// export default CmdServer

const spawn =  require('child_process').spawn

let arp_cmd = spawn('arp' ,['-a'])
let buffer = ''
arp_cmd.stdout.on('data', function (data) {
    buffer += data;
    // 8c:85:90:d1:41:dc
});
arp_cmd.on('close', function(code){
    console.log('closed with code ' + code);
    buffer = buffer.split(os.EOL)
    buffer = buffer.slice(0,buffer.length-1)
    buffer = buffer.map(d => {
        let s = d.split(' ')
        return {
            ip : s[1].substr(1,s[1].length-2),
            mac : s[3]
        }
    })
    console.log(buffer)
});
  
// 監聽 exit 事件：
arp_cmd.on('exit', function(code){
console.log('exited with code ' + code);
});



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
    if(line[0].toLowerCase()=="kick")
    {
        let li = line.slice(1,)
        li = li.map(function (x) { 
            return parseInt(x, 10); 
          });
        s.terminateBoard(li)
    }
    if(line[0].toLowerCase()=="upload"){
        s.wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN && client.borad_ID > -1) {
                let boardMsg = {
                    type: 'upload',
                    data: CONTROL[client.borad_ID] //boardData[client.boardId]
                    // wsdata: wsData[client.boardId]
                };
                client.send(JSON.stringify(boardMsg));
            }
        });
    }
}).on('close',function(){
    process.exit(0);
});
 