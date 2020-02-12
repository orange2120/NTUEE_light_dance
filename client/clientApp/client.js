// settings
const SERVER_MAC = "04:d9:f5:87:38:e2"
const PORT =8081

// client.js
const fs = require('fs')
const WebSocket = require('ws')
const os = require('os');
const spawn =  require('child_process').spawn

console.log("Scanning local network...")
let scan_cmd = spawn('./scan.sh' ,[])

let clientApp_cmd = spawn('./clientApp' ,[1])

scan_cmd.on("exit",function() {
  let arp_cmd = spawn('arp' ,['-a'])
  let buffer = ''
  let buffer1 = ''

  clientApp_cmd.stdout.on('data', function (data) {
      buffer1 += data;
      // 8c:85:90:d1:41:dc
  });

  arp_cmd.stdout.on('data', function (data) {
      buffer += data;
      // 8c:85:90:d1:41:dc
  });

  arp_cmd.on('close', function(code){
      // console.log('closed with code ' + code);

  });
  
  clientApp_cmd.on('close', function(code){
    console.log("cmdd: ",buffer1)
    buffer1=''
    // console.log('closed with code ' + code);

  });

  arp_cmd.on('exit', function(code){
  // console.log('exited with code ' + code);
      buffer = buffer.split(os.EOL)
      buffer = buffer.slice(0,buffer.length-1)
      buffer = buffer.map(d => {
          let s = d.split(' ')
          return {
              ip : s[1].substr(1,s[1].length-2),
              mac : s[3]
          }
      })
      let b = buffer.filter(obj => {
          return obj.mac === SERVER_MAC
      });
      if(b.length ==0){
          console.log(`Cannot find server with mac = ${SERVER_MAC} in local network`)
          return
      }
      console.log(`Find Server ${b[0].ip} ${b[0].mac}`)
      let url = 'ws://' + b[0].ip + ':' + String(PORT)

      function heartbeat() {
        clearTimeout(this.pingTimeout);
      
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.pingTimeout = setTimeout(() => {
          this.terminate();
        }, 3000 + 1000);
      }
      
      

      const connection = new WebSocket(url)
      console.log(`Connect to Server => ${url}`)
      let board_id=-1
      connection.onopen = () => {
        let response_msg ={
          type :  "request_to_join"
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
        if(msg.type === "ACKs" ){
          if(msg.data.ack_type === "request_to_join")
          {
            board_id = msg.data.board_id
            console.log(`Conected to Server with Borad ID=${board_id}`)
          }
        }else if(msg.type === "upload" ){
          fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
          console.log("Done")
        }else if(msg.type === "play" ){
          if(clientApp_cmd.killed){
            clientApp_cmd = spawn('./clientApp' ,[1])
          }
          clientApp_cmd.stdin.write('run\n')
          console.log("start playing")
        }else if(msg.type === "abort" ){
          if(!clientApp_cmd.killed){
            clientApp_cmd.kill('SIGINT')
          }
          
          console.log("send SIGINT")
        }
      }
      
      connection.onclose = (e)=>{
        clearTimeout(this.pingTimeout);
        console.log("server closed")
        
      }

  });



});

