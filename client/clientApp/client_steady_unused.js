// read settings
<<<<<<< HEAD
const os = require("os");
const fs = require("fs");
const path = require("path");

const rimraf = require("rimraf");

console.log("test");
=======
const os = require('os')
const fs = require('fs')
const path = require('path')

const rimraf = require("rimraf");

console.log("test")
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
// const ntpClient = require('ntp-client');
//  //pool.ntp.org
// ntpClient.getNetworkTime("192.168.0.200", 123, function(err, date) {
//     if(err) {
//         console.error(err);
//         return;
//     }
<<<<<<< HEAD

=======
 
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
//     console.log("Current time : ");
//     console.log(date); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
// });

<<<<<<< HEAD
=======

>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
// console.log(`Config file path at ${path.join(__dirname,"../../boards_config.json")}`)

// let CONFIG = fs.readFileSync(path.join(__dirname,"../../boards_config.json"))
// CONFIG = JSON.parse(CONFIG)

<<<<<<< HEAD
const SERVER_MAC = ""; //CONFIG.settings.server_mac_addr
const PORT = 8081;

const SERVER_IP = "192.168.0.200"; //CONFIG.settings.server_ip_addr

const PATH_clientApp = path.join(__dirname, "./clientApp");
let clientApp_cmd = "";

const WebSocket = require("ws");
// const ReconnectingWebSocket = require('reconnecting-websocket');

const spawn = require("child_process").spawn;
let need_reconnect = true;

function spawnClientApp() {
  if (clientApp_cmd != "" && !clientApp_cmd.killed) {
    clientApp_cmd.kill();
  }
  clientApp_cmd = spawn(PATH_clientApp, []);
  // clientApp_cmd.on('')

  console.log(`ClientApp Start at PID=${clientApp_cmd.pid}`);
}

function closeClientApp() {
  if (clientApp_cmd != "" && !clientApp_cmd.killed) {
    clientApp_cmd.kill("SIGUSR1");
    clientApp_cmd.kill(9);
    console.log("Kill ClientApp");
=======
const SERVER_MAC = ""//CONFIG.settings.server_mac_addr
const PORT = 8081

const SERVER_IP = "192.168.0.200"//CONFIG.settings.server_ip_addr

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
  clientApp_cmd = spawn( PATH_clientApp, [])
  // clientApp_cmd.on('')
  
  console.log(`ClientApp Start at PID=${clientApp_cmd.pid}`)
}

function closeClientApp() {
  if(clientApp_cmd != '' && !clientApp_cmd.killed) {
    clientApp_cmd.kill('SIGUSR1')
    clientApp_cmd.kill(9)
    console.log("Kill ClientApp")
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
  }
}

function isClientAppOn() {
<<<<<<< HEAD
  return clientApp_cmd != "" && !clientApp_cmd.killed;
}

function mainSocket() {
  // console.log(`Find Server ${b[0].ip} ${b[0].mac}`)
  let url = "ws://" + SERVER_IP + ":" + String(PORT);
  const connection = new WebSocket(url);
  console.log(`Connect to Server => ${url}`);
  function heartbeat(x) {
    clearTimeout(this.pingTimeout);
    let obj = JSON.parse(String(x));
=======
  return clientApp_cmd != '' && !clientApp_cmd.killed
}



function mainSocket() {
  // console.log(`Find Server ${b[0].ip} ${b[0].mac}`)
  let url = 'ws://' + SERVER_IP + ':' + String(PORT)
  const connection = new WebSocket(url)
  console.log(`Connect to Server => ${url}`)
  function heartbeat(x) {
    clearTimeout(this.pingTimeout);
    let obj = JSON.parse(String(x))
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
    // console.log(obj)
    // console.log(JSON.parse(String(x)))
    // connection.ping
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
<<<<<<< HEAD
      // this.terminate();
      console.log("too long");
    }, 3000 + 3000);
  }

  let board_id = -1;
  connection.onopen = () => {
    let response_msg = {
      type: "request_to_join",
      data: {
        board_type: "dancer",
        hostname: os.hostname(),
      },
    };
    connection.send(JSON.stringify(response_msg));
  };

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error.message}`);
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
        // spawnClientApp()
      }
    } else if (msg.type === "upload") {
      console.log(`Shutting down clientApp.. for server upload`);
      closeClientApp();
      if (msg.data.upload_type === "timeline") {
        let dd = [msg.data.data];
        if (!fs.existsSync(path.join(__dirname, "./json/current"))) {
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "no_leds",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc no_leds sent`);
        } else {
          fs.writeFileSync(
            path.join(__dirname, "./json/current/timeline.json"),
            JSON.stringify(dd)
          );
          console.log(`timeline file save`);
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "upload_timeline_ok",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc upload_ok sent`);
        }
      } else if (msg.data.upload_type === "leds") {
        // rimraf.sync(path.join(__dirname,"./json/current"));
        if (fs.existsSync(path.join(__dirname, "./json/current"))) {
          rimraf.sync(path.join(__dirname, "./json/current"));
          // fs.rmdirSync(path.join(__dirname,"./json/current"))
        }

        fs.mkdirSync(path.join(__dirname, "./json/current"));
        for (let i = 0; i < msg.data.leds.length; i++) {
          console.log(msg.data.leds[i].name);
          fs.writeFileSync(
            path.join(__dirname, "./json/current", msg.data.leds[i].name) +
              ".json",
            JSON.stringify(msg.data.leds[i].data)
          );
        }
        let response_msg = {
          type: "ACKc",
          data: {
            board_type: "dancer",
            ack_type: "upload_leds_ok",
          },
        };
        connection.send(JSON.stringify(response_msg));
        console.log(`ACKc upload_leds_ok sent`);
      } else if (msg.data.upload_type === "testing_timeline") {
        let dd = [msg.data.data];
        if (!fs.existsSync(path.join(__dirname, "./json/current"))) {
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "no_leds",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc no_leds sent`);
        } else {
          fs.writeFileSync(
            path.join(__dirname, "./json/current/timeline.json"),
            JSON.stringify(dd)
          );
          console.log(`timeline file save`);
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "upload_test_timeline_ok",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc upload_ok sent`);
        }
      }
    } else if (msg.type === "play") {
      // spawnClientApp()
      console.log(`recieved Play from ${msg.data.p}`);
      if (isClientAppOn()) {
        // while(Math.floor(new Date()/1) < msg.data.sc){
        //   console.log(new Date() / 1, msg.data.sc);

        // }
        clientApp_cmd.stdin.write("run " + String(msg.data.p) + "\n");
        console.log("Play");
        let response_msg = {
          type: "ACKc",
          data: {
            board_type: "dancer",
            ack_type: "playing",
          },
        };
        connection.send(JSON.stringify(response_msg));
        console.log(`ACKc playing sent`);
      } else {
        let response_msg = {
          type: "ACKc",
          data: {
            board_type: "dancer",
            ack_type: "err_not_prepared",
          },
        };
        connection.send(JSON.stringify(response_msg));
        console.log(`ACKc err_not_prepared sent`);
        console.log("ClientApp not started!!");
=======

      // this.terminate();
      console.log("too long")
    }, 3000 + 3000);
  }

  let board_id = -1
  connection.onopen = () => {
    let response_msg = {
      type: "request_to_join",
      data:{
        board_type:"dancer",
        hostname : os.hostname()
      }
    }
    connection.send(JSON.stringify(response_msg))
    
  }

  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error.message}`)
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
      console.log(`Shutting down clientApp.. for server upload`)
      closeClientApp()
      if (msg.data.upload_type === "timeline") {
        let dd = [msg.data.data]
        if (!fs.existsSync(path.join(__dirname,"./json/current"))) {
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "no_leds"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc no_leds sent`)
        } else{
          fs.writeFileSync(path.join(__dirname,"./json/current/timeline.json"), JSON.stringify(dd));
          console.log(`timeline file save`)
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "upload_timeline_ok"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc upload_ok sent`)
        }
        
        
      } else if (msg.data.upload_type === "leds") {
        // rimraf.sync(path.join(__dirname,"./json/current"));
        if (fs.existsSync(path.join(__dirname,"./json/current"))) {
          rimraf.sync(path.join(__dirname,"./json/current"));
          // fs.rmdirSync(path.join(__dirname,"./json/current"))
        }
        
        fs.mkdirSync(path.join(__dirname,"./json/current"))
        for (let i=0; i<msg.data.leds.length; i++) {
          console.log(msg.data.leds[i].name)
          fs.writeFileSync(path.join(__dirname,"./json/current",msg.data.leds[i].name) + ".json", JSON.stringify(msg.data.leds[i].data));
        }
        let response_msg = {
          type: "ACKc",
          data:{
            board_type:"dancer",
            ack_type : "upload_leds_ok"
          }
        }
        connection.send(JSON.stringify(response_msg))
        console.log(`ACKc upload_leds_ok sent`)
      } else if (msg.data.upload_type === "testing_timeline") {
        let dd = [msg.data.data]
        if (!fs.existsSync(path.join(__dirname,"./json/current"))) {
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "no_leds"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc no_leds sent`)
        } else{
          fs.writeFileSync(path.join(__dirname,"./json/current/timeline.json"), JSON.stringify(dd));
          console.log(`timeline file save`)
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "upload_test_timeline_ok"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc upload_ok sent`)
        }

      }
      
      
      
      

    } else if (msg.type === "play") {
      // spawnClientApp()
      console.log(`recieved Play from ${msg.data.p}`)
      if (isClientAppOn()) {
          // while(Math.floor(new Date()/1) < msg.data.sc){
          //   console.log(new Date() / 1, msg.data.sc);

          // }
          clientApp_cmd.stdin.write('run ' + String(msg.data.p) + '\n')
          console.log('Play')
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "playing"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc playing sent`)

      }else{
        let response_msg = {
          type: "ACKc",
          data:{
            board_type:"dancer",
            ack_type : "err_not_prepared"
          }
        }
        connection.send(JSON.stringify(response_msg))
        console.log(`ACKc err_not_prepared sent`)
        console.log('ClientApp not started!!')
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
      }
      // spawnClientApp()
      // clientApp_cmd.stdout.on('data',function(data){
      //   console.log('[clientApp] ' + data.toString())
      //   if ( data.toString().includes("run")) {
      //     clientApp_cmd.stdin.write('run ' + String(msg.data.p) + '\n')
<<<<<<< HEAD

      //     console.log('Done')
      //   }
      // })
      // // console.log('run ' + String(msg.data.play_from_time))

      // clientApp_cmd.stdin.write('run ' + String(msg.data.p) + '\n')
    } else if (msg.type === "pause") {
      console.log(`Pause from Server`);
      closeClientApp();
      let response_msg = {
        type: "ACKc",
        data: {
          board_type: "dancer",
          ack_type: "idle",
        },
      };
      connection.send(JSON.stringify(response_msg));
      console.log(`ACKc idle sent`);
    } else if (msg.type === "prepare") {
      console.log(`shutdown clientApp for prepare`);
      closeClientApp();
      spawnClientApp();
      clientApp_cmd.stderr.on("data", (data) => {
        console.log(`[ClientApp Error] ${data.toString()}`);
      });

      clientApp_cmd.stdout.on("data", function (data) {
        console.log("[clientApp] " + data.toString());
        if (data.toString().includes("run")) {
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "clientApp_ok",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc clientApp_ok sent`);
        }
      });
    } else if (msg.type === "safe_kick") {
      console.log("Safe Kick By Server");
      closeClientApp();
      need_reconnect = false;
      connection.terminate();
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done");
    } else if (msg.type === "reConnectClient") {
      console.log("Reconnect request By Server");
      closeClientApp();
      need_reconnect = true;
      connection.close;
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done");
    } else if (msg.type === "restart") {
      if (msg.data.restart_target === "clientSocket") {
        console.log("Restart Client Socket By Server");
        connection.close();
      } else if (msg.data.restart_target === "clientApp") {
        closeClientApp();
        spawnClientApp();
      } else if (msg.data.restart_target === "board") {
        console.log(`Shutting down clientApp.. for rpi reboot`);
        closeClientApp();
        console.log(`Shutting down connection.. for rpi reboot`);
        need_reconnect = false;
        connection.close();
        console.log(`Calling sudo reboot.. for rpi reboot`);
        require("child_process").exec("sudo reboot", function (msg) {
          console.log(msg);
        });
      } else {
        console.log(`Unknown restart target ${msg.data.restart_target}`);
      }
      console.log("Done");
    } else if (msg.type === "halt") {
      closeClientApp();
      require("child_process").exec("sudo halt", function (msg) {
        console.log(msg);
      });
    } else if (msg.type === "git_pull_force") {
      console.log(`Shutting down clientApp.. for git pull`);
      closeClientApp();
      const process_git_pull_force = spawn(
        path.join(__dirname, "./git_force_pull.sh")
      );
      process_git_pull_force.stdout.on("data", (data) => {
        console.log("[spawn stdout]", String(data));
        if (String(data).includes("HEAD is now at")) {
          // let d = String(data).split(' ')
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "git_pull_ok " + String(data).split(" ")[4],
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc git_pull_ok sent`);
=======
        
      //     console.log('Done')
      //   }
	    // })
      // // console.log('run ' + String(msg.data.play_from_time))
      
      // clientApp_cmd.stdin.write('run ' + String(msg.data.p) + '\n')
      
    } else if (msg.type === "pause") {
      console.log(`Pause from Server`)
      closeClientApp()
      let response_msg = {
        type: "ACKc",
        data:{
          board_type:"dancer",
          ack_type : "idle"
        }
      }
      connection.send(JSON.stringify(response_msg))
      console.log(`ACKc idle sent`)
    
    } else if (msg.type === "prepare") {
      console.log(`shutdown clientApp for prepare`)
      closeClientApp()
      spawnClientApp()
      clientApp_cmd.stderr.on('data',(data)=>{
        console.log(`[ClientApp Error] ${data.toString()}`)
      })

      clientApp_cmd.stdout.on('data',function(data){
        console.log('[clientApp] ' + data.toString())
        if ( data.toString().includes("run")) {

          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "clientApp_ok"
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc clientApp_ok sent`)
        }
      })       

    } else if (msg.type === "safe_kick") {
      console.log("Safe Kick By Server")
      closeClientApp()
      need_reconnect = false
      connection.terminate()
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done")
    } else if (msg.type === "reConnectClient") {
      console.log("Reconnect request By Server")
      closeClientApp()
      need_reconnect = true
      connection.close
      // fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
      console.log("Done")
    } else if (msg.type === "restart") {
      if (msg.data.restart_target === "clientSocket") {
        console.log("Restart Client Socket By Server")
        connection.close()
      } else if (msg.data.restart_target === "clientApp") {
        closeClientApp()
        spawnClientApp()
      } else if (msg.data.restart_target === "board") {
        console.log(`Shutting down clientApp.. for rpi reboot`)
        closeClientApp()
        console.log(`Shutting down connection.. for rpi reboot`)
        need_reconnect = false
        connection.close()
        console.log(`Calling sudo reboot.. for rpi reboot`)
        require('child_process').exec('sudo reboot', function (msg) { console.log(msg) });
      } else {
        console.log(`Unknown restart target ${msg.data.restart_target}`)
      }
      console.log("Done")
    } else if (msg.type === "halt" ) {
      closeClientApp()
      require('child_process').exec('sudo halt', function (msg) { console.log(msg) });
    } else if (msg.type === "git_pull_force" ) {
      console.log(`Shutting down clientApp.. for git pull`)
      closeClientApp()
      const process_git_pull_force = spawn(path.join(__dirname,"./git_force_pull.sh"));
      process_git_pull_force.stdout.on('data', (data) => {
        console.log('[spawn stdout]',String(data))
        if (String(data).includes("HEAD is now at")){
          // let d = String(data).split(' ')
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "git_pull_ok " + String(data).split(' ')[4]
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc git_pull_ok sent`)
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
        }
        // String(data)
        // console.log(`Received chunk ${data}`);
      });
      // require('child_process').exec(path.join(__dirname,"./git_force_pull.sh"), function (msg) { console.log(msg) });
<<<<<<< HEAD
    } else if (msg.type === "make_clientApp") {
      console.log(`Shutting down clientApp.. for make`);
      closeClientApp();
      const process_make_clientApp = spawn(
        path.join(__dirname, "./make_clientApp.sh")
      );
      process_make_clientApp.stdout.on("data", (data) => {
        console.log("[spawn stdout]", String(data));
        if (String(data).includes("FINISH")) {
          // let d = String(data).split(' ')
          let response_msg = {
            type: "ACKc",
            data: {
              board_type: "dancer",
              ack_type: "make_ok ",
            },
          };
          connection.send(JSON.stringify(response_msg));
          console.log(`ACKc make_ok sent`);
        }
      });
    } else {
      let response_msg = {
        type: "ACKc",
        data: {
          board_type: "dancer",
          ack_type: "cmd_not_exist",
        },
      };
      connection.send(JSON.stringify(response_msg));
      console.log(`ACKc cmd_not_exist sent`);
    }
  };

  connection.onclose = (e) => {
    clearTimeout(this.pingTimeout);
    console.log("client socket closed");
    closeClientApp();
    if (need_reconnect) {
      console.log("prepare to reconnect");
=======
    
    } else if (msg.type === "make_clientApp" ) {
      console.log(`Shutting down clientApp.. for make`)
      closeClientApp()
      const process_make_clientApp = spawn(path.join(__dirname,"./make_clientApp.sh"));
      process_make_clientApp.stdout.on('data', (data) => {
        console.log('[spawn stdout]',String(data))
        if (String(data).includes("FINISH")){
          // let d = String(data).split(' ')
          let response_msg = {
            type: "ACKc",
            data:{
              board_type:"dancer",
              ack_type : "make_ok "
            }
          }
          connection.send(JSON.stringify(response_msg))
          console.log(`ACKc make_ok sent`)
        }
      });
    } else{
      let response_msg = {
        type: "ACKc",
        data:{
          board_type:"dancer",
          ack_type : "cmd_not_exist"
        }
      }
      connection.send(JSON.stringify(response_msg))
      console.log(`ACKc cmd_not_exist sent`)
    }
  }

  connection.onclose = (e) => {
    clearTimeout(this.pingTimeout);
    console.log("client socket closed")
    closeClientApp()
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
=======
      return
    } else {
      process.exit()
    }

  }

}

mainSocket()
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
