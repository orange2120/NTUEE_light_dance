// read settings
const os = require('os')
const fs = require('fs')
const path = require('path')

console.log(`Config file path at ${path.join(__dirname,"../../boards_config.json")}`)

let CONFIG = fs.readFileSync(path.join(__dirname,"../../boards_config.json"))
CONFIG = JSON.parse(CONFIG)

const SERVER_MAC = CONFIG.settings.server_mac_addr
const PORT = 8081

const SERVER_IP = CONFIG.settings.server_ip_addr

const PATH_clientApp = path.join(__dirname,"./clientApp")
let clientApp_cmd = ""

const WebSocket = require('ws')
// const ReconnectingWebSocket = require('reconnecting-websocket');

const spawn = require('child_process').spawn
let need_reconnect = true

function spawnClientApp() {
  if (clientApp_cmd != "" && !clientApp_cmd.killed) {
    clientApp_cmd.kill()
  }
  clientApp_cmd = spawn(PATH_clientApp, [])
  // clientApp_cmd.on('')
  
  console.log(`ClientApp Start at PID=${clientApp_cmd.pid}`)
}


function mainSocket() {
  // console.log(`Find Server ${b[0].ip} ${b[0].mac}`)
  let url = 'ws://' + SERVER_IP + ':' + String(PORT)


  const connection = new WebSocket(url)

  // const connection = new ReconnectingWebSocket(url, [], {
  //   maxReconnectionDelay: 1000,
  //   minReconnectionDelay: 1000,
  //   reconnectionDelayGrowFactor: 1,
  //   connectionTimeout: 1000,
  //   maxRetries: Infinity,
  //   WebSocket: require('ws')
  // });


  console.log(`Connect to Server => ${url}`)
  function heartbeat(x) {
    clearTimeout(this.pingTimeout);
    let obj = JSON.parse(String(x))
    // console.log(JSON.parse(String(x)))
    // connection.ping
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {

      this.terminate();
      console.log("too long")
    }, 3000 + 3000);
  }

  let board_id = -1
  connection.onopen = () => {
    let response_msg = {
      type: "request_to_join",
      data:{
        board_type:"dancer"
      }
    }
    connection.send(JSON.stringify(response_msg))
    
  }

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
  }
  connection.on('ping', heartbeat);
  connection.onmessage = (e) => {
    console.log(e.data)
    let msg = JSON.parse(e.data)
    if (msg.type === "ACKs") { // for ACK messages 
      if (msg.data.ack_type === "request_to_join") {
        board_id = msg.data.board_id
        console.log(`Conected to Server with Borad ID=${board_id}`)
        // spawnClientApp()
        
      }
    } else if (msg.type === "upload") {
      fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done")
    } else if (msg.type === "play") {
      // spawnClientApp()
      console.log(`Play from ${msg.data.p}`)
      spawnClientApp()
      clientApp_cmd.stdout.on('data',function(data){
        console.log(data)
        clientApp_cmd.stdin.write('run ' + String(msg.data.p) + '\n')
        console.log('Done')
      })
      // console.log('run ' + String(msg.data.play_from_time))
      
      
      
    } else if (msg.type === "pause") {
      console.log(`Pause from Server`)
      if(clientApp_cmd != '' && !clientApp_cmd.killed) {
	      clientApp_cmd.kill('SIGUSR1')
	      clientApp_cmd.kill()
      }
      //clientApp_cmd.kill("SIGUSR1") //pause
      //clientApp_cmd.kill()
      // spawnClientApp()
      console.log("Done")
    } else if (msg.type === "safe_kick") {
      console.log("Safe Kick By Server")
      need_reconnect = false
      connection.terminate()
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done")
    } else if (msg.type === "reConnectClient") {
      console.log("Reconnect request By Server")
      need_reconnect = true
      connection.terminate()
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done")
    } else if (msg.type === "restart") {
      if (msg.data.restart_target === "clientSocket") {
        console.log("Restart Client Socket By Server")
        connection.close()
      } else if (msg.data.restart_target === "clientApp") {

        spawnClientApp()
      } else {
        console.log(`Unknown restart target ${msg.data.restart_target}`)
      }

      console.log("Done")
    }
  }

  connection.onclose = (e) => {
    clearTimeout(this.pingTimeout);
    console.log("client socket closed")
    if (clientApp_cmd != "" && !clientApp_cmd.killed) {
      clientApp_cmd.kill()
    }
    if (need_reconnect) {
      console.log("prepare to reconnect")

      setTimeout(function () {
        mainSocket();
      }, 1000);
      return
    } else {
      process.exit()
    }

  }

}

mainSocket()
