const fs = require("fs");
const WebSocket = require("ws");
const os = require("os");
const path = require("path");

const udp = require("dgram");

const libarp = require("arp");

const math = require("mathjs");

const { PNG } = require("pngjs");

const axios = require("axios").default;
const getPixels = require("get-pixels");

const DANCER_NUM = 8;
const LED_PATH = "../asset/LED/";
const TESTDATA_PATH = "../data/json/testing_timeline.json";

const RPI_DELAY_ADJUST = 300;
const FAN_DELAY_ADJUST = 300;

function arr_transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

class CmdServer {
  constructor(_port = 8081, _config) {
    this.testing_timeline = [];
    this.wss = new WebSocket.Server({ port: _port });
    this.udp_server = udp.createSocket("udp4");
    this.init_UDP_Server();
    this.udp_server.bind(2222);

    this.pngs = {};
    // this.wss.waitingList = []
    this.config = -1;
    this.loadConfig(_config);
    this.server_ip = "serverip"; // this.getLocalIp()
    // this.BOARDS=[]

    this.wss.on("connection", this.processConnection);

    this.initInterval();
  }

  init_UDP_Server() {
    const self = this;
    this.udp_server.on("error", function (error) {
      console.log(`[Udp Server] Server Error: ${error}`);
      self.udp_server.close();
    });
    this.udp_server.on("listening", function () {
      const address = self.udp_server.address();
      const { port, family } = address;
      const ipaddr = address.address;
      console.log(`[Udp Server] Server is listening at port ${port}`);
      console.log(`[Udp Server]Server ip : ${ipaddr}`);
      console.log(`[Udp Server] Server is IP4/IP6 :  ${family}`);
    });
    this.udp_server.on("close", function () {
      console.log("[Udp Server] Socket is closed !");
    });
    this.udp_server.on("message", function (msg, info) {
      const recieve_timestamp = new Date();
      console.log(`[Udp Server] Data received from client : ${msg.toString()}`);
      console.log(
        "[Udp Server] Received %d bytes from %s:%d\n",
        msg.length,
        info.address,
        info.port
      );
      if (msg.toString().startsWith("re")) {
        let msg_parse = msg.toString().split("_")[1];
        msg_parse = Number(msg_parse);
        const d = new Date();
        // console.log('before',d)
        d.setMilliseconds(d.getMilliseconds() + msg_parse);
        // console.log('aafter',d)
        // d = d + msg_parse
        const msg_date = Buffer.from(d.toISOString());
        // sending msg
        self.udp_server.send(msg_date, info.port, info.address, function (
          error
        ) {
          if (error) {
            // client.close();
          } else {
            console.log("[Udp Server] time Data sent !!!");
          }
        });
      } else {
        let parse_msg = JSON.parse(msg.toString());

        parse_msg.t1 = Math.floor(recieve_timestamp / 1);
        parse_msg.t2 = Math.floor(new Date() / 1);
        const data_buffer = Buffer.from(JSON.stringify(parse_msg));
        self.udp_server.send(data_buffer, info.port, info.address, function (
          error
        ) {
          if (error) {
            // client.close();
          } else {
            console.log("[Udp Server] t1 Data sent !!!");
          }
        });
      }
    });
  }

  startServer() {}

  loadConfig(_config) {
    if (this.config !== -1) {
      this.wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // this.sendToBoards("{}",[client.board_ID])
          console.log(
            `[Server] Kick Board(${client.board_ID}) at ${client.ipAddr} for reload config`
          );
          client.terminate();
          // console.log(`[Server] Kick Board(${client.board_ID}) at ${client.ipAddr}`)
        }
      });
    }

    this.config = _config;
    this.wss.BOARDS = this.config.boards.map((obj) => {
      obj.status = "disconnect";
      obj.msg = "";
      return obj;
    });

    for (let i = 0; i < this.wss.BOARDS.length; ++i) {
      this.wss.BOARDS[i].id = i;
    }
  }

  printServerSats() {
    console.log("[Server Status]");
    console.log(`Server local ip:  ${String(this.server_ip)}`);
    console.log("Boards");
    for (let i = 0; i < this.wss.BOARDS.length; ++i) {
      console.log(
        " (" +
          String(this.wss.BOARDS[i].id) +
          ") " +
          String(this.wss.BOARDS[i].ip) +
          " " +
          String(this.wss.BOARDS[i].status)
      );
    }
    // console.log(this)
    console.log("");
  }
  getBoardsInfo() {
    return this.wss.BOARDS;
  }
  getCurrentInfo() {
    let ret = {
      boards: this.wss.BOARDS,
      waitingList: [],
    };
    // console.log(this.wss.clients)
    this.wss.clients.forEach((client) => {
      if (client.board_ID == -1) {
        ret.waitingList.push({
          hostname: client.hostname,
          ip: client.ipAddr,
          board_type: client.board_type,
        });
      }
    });
    return ret;
  }
  terminateBoard(_id = []) {
    // if id=[] : only remove board that is not alive
    // console.log("[Server] kick boards")
    this.wss.clients.forEach((client) => {
      if (client.isAlive == false && client.board_ID == -1) {
        client.terminate();
        this.wss.BOARDS[client.board_ID].status = "disconnect";
        console.log(
          `[Server] Unregistered Board remove upexpectedly (${client.board_ID}) at ${client.ipAddr}`
        );
      }
      //else
      if (
        client.readyState === WebSocket.OPEN &&
        _id.includes(client.board_ID)
      ) {
        // this.sendToBoards("{}",[client.board_ID])
        client.send(
          JSON.stringify({
            type: "safe_kick",
          }),
          () => {
            // this.wss.BOARDS[client.board_ID].status = "disconnect"
            // client.terminate()
            console.log(
              `[Server] Kick Board(${client.board_ID}) at ${client.ipAddr}`
            );
          }
        );
      }
    });
    // console.log("[Server] done")
    console.log("");
  }
  processConnection(ws, req) {
    ws.board_ID = -1;
    ws.ipAddr = "";
    ws.hostname = "";
    ws.isAlive = true;

    ws.transmit_delay = -1;

    function heartbeat(x) {
      this.isAlive = true;
      let obj = JSON.parse(String(x));

      // console.log((Date.now() - obj.server_time)/2)
      this.transmit_delay = (Date.now() - obj.server_time) / 2;
    }
    ws.on("pong", heartbeat);
    // console.log('jj')
    // console.log(this)
    const ip = req.connection.remoteAddress.split(":")[3];
    ws.ipAddr = ip;

    let server_self = this;
    ws.on("message", (message) => {
      let response_msg = {
        type: "empty",
      };
      // ws.send(JSON.stringify(response_msg))
      console.log("");
      console.log(`[Client] ${ip} : ${message}`);
      message = JSON.parse(message);
      if (message.type === "request_to_join") {
        // new board request to join
        let self = this;

        ws.board_type = message.data.board_type;
        ws.hostname = message.data.hostname;

        let boards_correspond_id = -1;
        for (let i = 0; i < self.BOARDS.length; ++i) {
          if (self.BOARDS[i].hostname === ws.hostname) {
            boards_correspond_id = self.BOARDS[i].id;
          }
        }
        if (boards_correspond_id == -1) {
          console.log(`[Server] Board(${ws.hostname}) not registered`);
        } else {
          let tt = new Date();
          console.log(
            `[Server] Connecting Board: ip = ${ip} hostname = ${ws.hostname} id = ${self.BOARDS[boards_correspond_id].id}`
          );
          response_msg.type = "ACKs";
          response_msg.data = {
            ack_type: "request_to_join",
            board_id: self.BOARDS[boards_correspond_id].id,
            server_time: tt.toISOString(),
          };

          ws.send(JSON.stringify(response_msg));
          self.BOARDS[boards_correspond_id].status = "connected";
          self.BOARDS[boards_correspond_id].msg = "idle";
          self.BOARDS[boards_correspond_id].ip = ip;
          self.BOARDS[boards_correspond_id].board_type =
            message.data.board_type;
          ws.board_ID = self.BOARDS[boards_correspond_id].id;
          ws.ipAddr = ip;

          console.log("[Server] ACKs sent");
        }

        // console.log(this.BOARDS)
      } else if (message.type === "ACKc") {
        server_self.BOARDS[ws.board_ID].msg = message.data.ack_type;
        // server_self.update_Board_Msg(ws.board_ID,message.data.ack_type)
      }
    });
    // ws.send('Hello! Message From Server!!')
    ws.on("close", function s() {
      if (ws.board_ID != -1) {
        // console.log(server_self.BOARDS[ws.board_ID])
        if (server_self.BOARDS[ws.board_ID] != undefined) {
          server_self.BOARDS[ws.board_ID].status = "disconnect";
        }
      }
      console.log(
        `[Client] (${ws.board_ID}) ${ws.ipAddr} ${ws.hostname} leave`
      );
    });
  }
  sendToBoards(msg, ids) {
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        ids.includes(client.board_ID)
      ) {
        // let boardMsg = {
        //     type: 'upload',
        //     data: CONTROL[client.board_ID] //boardData[client.boardId]
        //     // wsdata: wsData[client.boardId]
        // };
        client.send(JSON.stringify(msg));
      }
    });
  }
  initInterval() {
    // function noop() {}
    let self = this;
    const interval = setInterval(function ping() {
      self.wss.clients.forEach(function each(client) {
        // checking board if still connected
        // console.log("checking id=" + String(ws.board_ID))
        if (client.isAlive === false) {
          // self.terminateBoard()
          // client.terminate()
          if (client.board_ID != -1) {
            // self.wss.BOARDS[client.board_ID].status = "disconnect"
            console.log(
              `[Server] Board(registered) remove upexpectedly (${client.board_ID}) at ${client.ipAddr}`
            );
          } else {
            console.log(
              `[Server] Board(Not registered) remove upexpectedly at ${client.ipAddr}`
            );
          }
          return; //ws.terminate();
        }

        client.isAlive = false;
        //   send server time and connection delay time
        client.ping(
          JSON.stringify({
            server_time: Date.now(),
            delay: client.transmit_delay,
          }),
          {},
          true
        );
        // console.log(client.transmit_delay)
        //   ws.ping(noop);
      });
    }, this.config.settings.ping_interval);
  }
  async getBoardByIP(_ip) {
    let find_board = await this.BOARDS.filter((obj) => {
      return obj.ip === String(_ip);
    });
    return find_board;
  }

  play(cmd_start_time, params) {
    let msg = {
      type: "play",
      data: {
        s: cmd_start_time, //start_at_server
        p: params.time, //play_from_time
        sc: params.start_at_time,
      },
    };
    console.log(msg);
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        if (client.board_type === "raspberrypi") {
          // rpi clientApp constant delay
          msg.sc = msg.sc + RPI_DELAY_ADJUST; //+ 300 //- 300
        } else if (client.board_type === "fan") {
          msg.sc = msg.sc + FAN_DELAY_ADJUST; //+ 300 //- 300
        }
        // let boardMsg = {
        //     type: 'upload',
        //     data: CONTROL[client.board_ID] //boardData[client.boardId]
        //     // wsdata: wsData[client.boardId]
        // };
        client.send(JSON.stringify(msg));
      }
    });
    // this.sendToBoards(msg, params.ids)
  }
  pause(cmd_start_time, params) {
    let msg = {
      type: "pause",
      data: {
        start_at_server: cmd_start_time,
      },
    };
    this.sendToBoards(msg, params.ids);
  }

  prepare(cmd_start_time, params) {
    for (let i = 0; i < params.ids.length; ++i) {
      this.wss.BOARDS[params.ids[i]].msg = "preparing";
    }
    let boardMsg = {
      type: "prepare",
      data: {}, //control
    };
    this.sendToBoards(boardMsg, params.ids);
  }

  time_sync(cmd_start_time, params) {
    for (let i = 0; i < params.ids.length; ++i) {
      this.wss.BOARDS[params.ids[i]].msg = "Syncing";
    }
    let boardMsg = {
      type: "time_sync",
      data: {}, //control
    };
    this.sendToBoards(boardMsg, params.ids);
  }

  upload_timeline(cmd_start_time, params, control) {
    let self = this;
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        self.wss.BOARDS[client.board_ID].msg = "uploading_timeline";
        console.log("upload", client.board_ID);
        let boardMsg = {};
        if (client.board_type === "dancer") {
          boardMsg = {
            type: "upload",
            data: {
              upload_type: "timeline",
              data: self.tmp_control[client.board_ID],
            }, //control
          };
        } else {
          boardMsg = {
            type: "upload",
            data: self.tmp_control[client.board_ID],
            //control
          };
          console.log(boardMsg);
        }
        client.send(JSON.stringify(boardMsg));
      }
    });
  }
  upload_leds(cmd_start_time, params) {
    let self = this;

    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        self.wss.BOARDS[client.board_ID].msg = "uploading_leds";
        console.log("upload", client.board_ID);
        let boardMsg = {};
        if (client.board_type === "dancer") {
          boardMsg = {
            type: "upload",
            data: {
              upload_type: "leds",
              leds: self.pngs, // + self.pngs["LED_L_SHOE"] + self.pngs["LED_R_SHOE"]
            },
          };
        } else {
          boardMsg = {
            type: "upload",
            data: {
              upload_type: "leds",
              leds: self.pngs, //+ self.pngs["LED_L_SHOE"] + self.pngs["LED_R_SHOE"]
            },
          };
        }
        client.send(JSON.stringify(boardMsg));
      }
    });
  }
  process_control() {
    // console.log(control)

    let self = this;
    for (let i = 0; i < 8; ++i) {
      self.tmp_control.push([]);
    }

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.board_ID != -1) {
        console.log("processing", client.board_ID);

        if (client.board_type === "dancer" || client.board_type === "fan") {
          self.tmp_control[client.board_ID] = self.tmp_control[
            client.board_ID
          ].map((frame) => {
            let new_frame = JSON.parse(JSON.stringify(frame));
            // console.log(frame)
            if (new_frame["Status"]["LED_CHEST"]["name"] === "") {
              new_frame["Status"]["LED_CHEST"]["name"] = "bl_chest";
            }
            if (new_frame["Status"]["LED_R_SHOE"]["name"] === "") {
              new_frame["Status"]["LED_R_SHOE"]["name"] = "bl_shoe";
            }
            if (new_frame["Status"]["LED_L_SHOE"]["name"] === "") {
              new_frame["Status"]["LED_L_SHOE"]["name"] = "bl_shoe";
            }
            if (new_frame["Status"]["LED_FAN"]["name"] === "") {
              new_frame["Status"]["LED_FAN"]["name"] = "bl_fan";
            }
            return new_frame;
          });

          // console.log("processing", client.board_ID)
        }

        // }else
        if (client.board_type === "fan") {
          let corresspond_dancer = client.board_ID - DANCER_NUM;
          let new_control = {};
          new_control["timeline"] = self.tmp_control[corresspond_dancer].map(
            (frame) => {
              let new_frame = {};
              new_frame["Start"] = frame["Start"];
              new_frame["name"] = frame["Status"]["LED_FAN"]["name"];
              new_frame["alpha"] = frame["Status"]["LED_FAN"]["alpha"];
              return new_frame;
            }
          );
          // new_control["picture"] =   self.pngs["LED_FAN"]
          let thin_control = {};
          thin_control["timeline"] = [];
          thin_control["timeline"].push(new_control["timeline"][0]);
          console.log(thin_control);
          let last_idx = 0;
          for (let i = 1; i < new_control["timeline"].length; ++i) {
            if (
              new_control["timeline"][i - 1]["name"] ===
                new_control["timeline"][i]["name"] &&
              new_control["timeline"][i - 1]["alpha"] ===
                new_control["timeline"][i]["alpha"]
            ) {
            } else {
              thin_control["timeline"].push(new_control["timeline"][i]);
            }
          }
          console.log(thin_control);
          self.tmp_control[client.board_ID] = thin_control;
        }
      }
    });
  }
  compile(control) {
    this.load_testing_timeline();
    this.tmp_control = JSON.parse(JSON.stringify(control));
    this.pngs = [];
    this.convert_png("LED_FAN");
    this.convert_png("LED_CHEST");
    this.convert_png("LED_L_SHOE");
    this.convert_png("LED_R_SHOE");
    this.process_control();
  }
  load_testing_timeline() {
    this.testing_timeline = [];
    this.testing_timeline = JSON.parse(
      fs.readFileSync(path.join(__dirname, TESTDATA_PATH))
    );
  }
  convert_png(f) {
    // this.pngs[f] = {}
    const directoryPath = path.join(__dirname, LED_PATH + f);
    //passsing directoryPath and callback function
    let self = this;
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach

      files.forEach(function (file) {
        // Do whatever you want to do with the file
        if (file.endsWith(".png")) {
          let rotate = 1;
          let data = fs.readFileSync(path.join(__dirname, LED_PATH + f, file));
          let png = PNG.sync.read(data);

          let pixels_raw = Array.from(png.data);

          let img_arr = [];
          let width = png.width;
          let height = png.height;
          img_arr = math.reshape(pixels_raw, [height, width, 4]);

          for (let i = 0; i < rotate; ++i) {
            // to rotate 90 degree -> reverse then transpose
            img_arr.reverse();
            img_arr = arr_transpose(img_arr);
          }

          width = img_arr[0].length;
          height = img_arr.length;

          // flip odd row
          img_arr = img_arr.map((r, i) => {
            if (i % 2 === 1) {
              r.reverse();
            }
            return r;
          });
          // remove alpha data
          img_arr = img_arr.map((r) =>
            r.map((p) => {
              p.pop();
              return p;
            })
          );

          if (f === "LED_FAN") {
            img_arr = img_arr.map((r) =>
              r.map((p) => {
                let ret = p[0];
                ret = ret << 8;
                ret = ret + p[1];
                ret = ret << 8;
                ret = ret + p[2];
                return ret;
              })
            );
          } else {
            // console.log(img_arr)
          }
          img_arr = math.flatten(img_arr);
          // console.log(img_arr)
          let new_led = {
            name: file.substr(0, file.length - 4),
            data: img_arr,
          };
          // self.pngs[f][file.substr(0,file.length-4)]=img_arr
          self.pngs.push(new_led);
          // console.log("Convert",file);
          // console.log(rgb_arr)

          // let filee = fs.createWriteStream('array.txt');
          // filee.on('error', function(err) { /* error handling */ });
          // img_arr.forEach(function(v) { filee.write(v.join(', ') ); });
          // filee.end();
        }
      });
    });
  }
  upload_test(cmd_start_time, params) {
    let self = this;
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        self.wss.BOARDS[client.board_ID].msg = "uploading_testing_data";
        console.log("uploading_testing_data", client.board_ID);
        let boardMsg = {};
        if (client.board_type === "dancer") {
          boardMsg = {
            type: "upload",
            data: {
              upload_type: "testing_timeline",
              data: self.testing_timeline[client.board_ID],
            }, //control
          };
        } else {
          boardMsg = {
            type: "fuck",
            data: [],
            //control
          };
          console.log(boardMsg);
        }
        client.send(JSON.stringify(boardMsg));
      }
    });
  }
  update_Board_Msg(id, s) {
    this.wss.BOARDS[id].msg = s;
  }

  // png2rgb_arr("<path>",rotate(times of 90 degree right),callback function)
  async png2rgb_arr(path, rotate = 1, callback) {
    // path = "asset/LED/LED_CHEST/chest1.png"
    getPixels(path, function (err, pixels) {
      if (err) {
        console.log("Bad image path");
        return;
      }
      let pixels_raw = Array.from(pixels.data);

      let img_arr = [];
      let width = pixels.shape[0];
      let height = pixels.shape[1];
      // console.log("got pixels", pixels.shape.slice())
      // console.log(pixels_raw)
      img_arr = math.reshape(pixels_raw, [height, width, 4]);

      for (let i = 0; i < rotate; ++i) {
        // to rotate 90 degree -> reverse then transpose
        img_arr.reverse();
        img_arr = this.arr_transpose(img_arr);
      }

      width = img_arr[0].length;
      height = img_arr.length;

      // flip odd row
      img_arr.map((r, i) => {
        if (i % 2 === 1) {
          r.reverse();
        }
        return r;
      });
      // remove alpha data
      img_arr.map((r) =>
        r.map((p) => {
          p.pop();
          return p;
        })
      );

      callback(img_arr.flat(3));
    });
  }

  rebootBoard(cmd_start_time, params) {
    let msg = {
      type: "restart",
      data: {
        restart_target: "board",
      },
    };
    console.log(params);
    this.sendToBoards(msg, params.ids);
  }
  haltBoard(cmd_start_time, params) {
    let msg = {
      type: "halt",
      data: {},
    };
    console.log(params);
    this.sendToBoards(msg, params.ids);
  }
  git_pull(cmd_start_time, params, forced = true) {
    let self = this;
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        self.wss.BOARDS[client.board_ID].msg = "git pulling";
        console.log("git pull ", client.board_ID);
        let boardMsg = {};
        boardMsg = {
          type: "git_pull_force",
          data: {}, //control
        };

        client.send(JSON.stringify(boardMsg));
      }
    });
  }
  make_clientApp(cmd_start_time, params) {
    let self = this;
    this.wss.clients.forEach((client) => {
      if (
        client.readyState === WebSocket.OPEN &&
        params.ids.includes(client.board_ID)
      ) {
        self.wss.BOARDS[client.board_ID].msg = "making clientApp";
        console.log("make", client.board_ID);
        let boardMsg = {};
        boardMsg = {
          type: "make_clientApp",
          data: {}, //control
        };

        client.send(JSON.stringify(boardMsg));
      }
    });
  }
  runTest(cmd_start_time, params) {
    let msg = {
      type: "runTest",
    };
    this.sendToBoards(msg, params.ids);
  }
  reConnectClient(cmd_start_time, params) {
    let msg = {
      type: "reConnectClient",
    };
    this.sendToBoards(msg, params.ids);
  }
}
// export default CmdServer
module.exports = CmdServer;
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
