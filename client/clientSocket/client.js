// settings

<<<<<<< HEAD
const SERVER_MAC = "8c:85:90:d1:41:dc";
const PORT = 8081;
const PATH_clientApp = "../clientApp/clientApp";
// client.js
const fs = require("fs");
const WebSocket = require("ws");
// const ReconnectingWebSocket = require('reconnecting-websocket');

const os = require("os");
const spawn = require("child_process").spawn;
let need_reconnect = true;

function main() {
  console.log("Scanning local network...");
  let scan_cmd = spawn("./scan.sh", []);

  // let clientApp_cmd = spawn('../clientApp/clientApp' ,[1])
  // let clientApp_cmd = spawn('./clientApp_sim' ,[1])
  let clientApp_cmd = "";
  function spawnClientApp() {
    if (clientApp_cmd != "" && !clientApp_cmd.killed) {
      clientApp_cmd.kill();
    }
    clientApp_cmd = spawn(PATH_clientApp, [1]);
  }

  scan_cmd.on("exit", function () {
    let arp_cmd = spawn("arp", ["-a"]);
    let buffer = "";

    arp_cmd.stdout.on("data", function (data) {
=======
const SERVER_MAC = "8c:85:90:d1:41:dc"
const PORT = 8081
const PATH_clientApp = "../clientApp/clientApp"
// client.js
const fs = require('fs')
const WebSocket = require('ws')
// const ReconnectingWebSocket = require('reconnecting-websocket');

const os = require('os');
const spawn = require('child_process').spawn
let need_reconnect = true

function main() {
  console.log("Scanning local network...")
  let scan_cmd = spawn('./scan.sh', [])

  // let clientApp_cmd = spawn('../clientApp/clientApp' ,[1])
  // let clientApp_cmd = spawn('./clientApp_sim' ,[1])
  let clientApp_cmd = ""
  function spawnClientApp() {
    if (clientApp_cmd != "" && !clientApp_cmd.killed) {
      clientApp_cmd.kill()
    }
    clientApp_cmd = spawn(PATH_clientApp, [1])
  }
  

  scan_cmd.on("exit", function () {
    let arp_cmd = spawn('arp', ['-a'])
    let buffer = ''

    arp_cmd.stdout.on('data', function (data) {
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
      buffer += data;
      // 8c:85:90:d1:41:dc
    });

<<<<<<< HEAD
    arp_cmd.on("close", function (code) {
      // console.log('closed with code ' + code);
    });

    arp_cmd.on("exit", function (code) {
      // console.log('exited with code ' + code);
      buffer = buffer.split(os.EOL);
      buffer = buffer.slice(0, buffer.length - 1);
      buffer = buffer.map((d) => {
        let s = d.split(" ");
        return {
          ip: s[1].substr(1, s[1].length - 2),
          mac: s[3],
        };
      });
      let b = buffer.filter((obj) => {
        return obj.mac === SERVER_MAC;
      });
      if (b.length == 0) {
        console.log(
          `Cannot find server with mac = ${SERVER_MAC} in local network`
        );
        process.exit();
        return;
      }

      function mainSocket() {
        console.log(`Find Server ${b[0].ip} ${b[0].mac}`);
        let url = "ws://" + b[0].ip + ":" + String(PORT);

        const connection = new WebSocket(url);
=======
    arp_cmd.on('close', function (code) {
      // console.log('closed with code ' + code);

    });

    arp_cmd.on('exit', function (code) {
      // console.log('exited with code ' + code);
      buffer = buffer.split(os.EOL)
      buffer = buffer.slice(0, buffer.length - 1)
      buffer = buffer.map(d => {
        let s = d.split(' ')
        return {
          ip: s[1].substr(1, s[1].length - 2),
          mac: s[3]
        }
      })
      let b = buffer.filter(obj => {
        return obj.mac === SERVER_MAC
      });
      if (b.length == 0) {
        console.log(`Cannot find server with mac = ${SERVER_MAC} in local network`)
        process.exit()
        return
      }

      function mainSocket() {
        console.log(`Find Server ${b[0].ip} ${b[0].mac}`)
        let url = 'ws://' + b[0].ip + ':' + String(PORT)


        const connection = new WebSocket(url)
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0

        // const connection = new ReconnectingWebSocket(url, [], {
        //   maxReconnectionDelay: 1000,
        //   minReconnectionDelay: 1000,
        //   reconnectionDelayGrowFactor: 1,
        //   connectionTimeout: 1000,
        //   maxRetries: Infinity,
        //   WebSocket: require('ws')
        // });

<<<<<<< HEAD
        console.log(`Connect to Server => ${url}`);
        function heartbeat(x) {
          clearTimeout(this.pingTimeout);
          let obj = JSON.parse(String(x));
          console.log(JSON.parse(String(x)));
=======

        console.log(`Connect to Server => ${url}`)
        function heartbeat(x) {
          clearTimeout(this.pingTimeout);
          let obj = JSON.parse(String(x))
          console.log(JSON.parse(String(x)))
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
          // connection.ping
          // Use `WebSocket#terminate()`, which immediately destroys the connection,
          // instead of `WebSocket#close()`, which waits for the close timer.
          // Delay should be equal to the interval at which your server
          // sends out pings plus a conservative assumption of the latency.
          this.pingTimeout = setTimeout(() => {
<<<<<<< HEAD
            this.terminate();
            console.log("too long");
          }, 1000 + 3000);
        }

        let board_id = -1;
        connection.onopen = () => {
          let response_msg = {
            type: "request_to_join",
            data: {
              board_type: "dancer",
            },
          };
          connection.send(JSON.stringify(response_msg));
        };

        connection.onerror = (error) => {
          console.log(`WebSocket error: ${error}`);
        };
        connection.on("ping", heartbeat);
        connection.onmessage = (e) => {
          console.log(e.data);
          let msg = JSON.parse(e.data);
          if (msg.type === "ACKs") {
            // for ACK messages
            if (msg.data.ack_type === "request_to_join") {
              board_id = msg.data.board_id;
              console.log(`Conected to Server with Borad ID=${board_id}`);
              spawnClientApp();
              console.log(`ClientApp Start at PID=${clientApp_cmd.pid}`);
            }
          } else if (msg.type === "upload") {
            fs.writeFileSync("recieve.json", JSON.stringify(msg.data));
            console.log("Done");
          } else if (msg.type === "play") {
            console.log(`Play from ${msg.data.play_from_time}`);
            clientApp_cmd.stdin.write("run " + String(msg.data.play_from_time));
            console.log("Done");
          } else if (msg.type === "pause") {
            console.log(`Pause from Server`);
            clientApp_cmd.kill("SIGUSR1"); //pause
            console.log("Done");
          } else if (msg.type === "safe_kick") {
            console.log("Safe Kick By Server");
            need_reconnect = false;
            connection.terminate();
            // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
            console.log("Done");
          } else if (msg.type === "reConnectClient") {
            console.log("Reconnect request By Server");
            need_reconnect = true;
            connection.terminate();
            // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
            console.log("Done");
          } else if (msg.type === "restart") {
            if (msg.data.restart_target === "clientSocket") {
              console.log("Restart Client Socket By Server");
              connection.close();
            } else if (msg.data.restart_target === "clientApp") {
              spawnClientApp();
            } else {
              console.log(`Unknown restart target ${msg.data.restart_target}`);
            }

            console.log("Done");
          }
        };

        connection.onclose = (e) => {
          clearTimeout(this.pingTimeout);
          console.log("client socket closed");
          if (clientApp_cmd != "" && !clientApp_cmd.killed) {
            clientApp_cmd.kill();
          }
          if (need_reconnect) {
            console.log("prepare to reconnect");
=======

            this.terminate();
            console.log("too long")
          }, 1000 + 3000);
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
              spawnClientApp()
              console.log(`ClientApp Start at PID=${clientApp_cmd.pid}`)
            }
          } else if (msg.type === "upload") {
            fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
            console.log("Done")
          } else if (msg.type === "play") {
            console.log(`Play from ${msg.data.play_from_time}`)
            clientApp_cmd.stdin.write('run ' + String(msg.data.play_from_time))
            console.log('Done')
          } else if (msg.type === "pause") {
            console.log(`Pause from Server`)
            clientApp_cmd.kill("SIGUSR1") //pause
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
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0

            setTimeout(function () {
              mainSocket();
            }, 1000);
<<<<<<< HEAD
            return;
          } else {
            process.exit();
          }
        };
      }

      mainSocket();
    });
  });
}

main();
=======
            return
          } else {
            process.exit()
          }

        }

      }


      mainSocket()
    });

  });

}

main()
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
