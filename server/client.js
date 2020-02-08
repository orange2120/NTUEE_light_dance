
// client.js
const fs = require('fs')
const WebSocket = require('ws')
const os = require('os')
// const url = 'ws://localhost:8081'
const url = 'ws://192.168.1.6:8081'

/*
const spawn =  require('child_process').spawn

class AddressUtilities
{
  constructor(){

  }
  async fetch_list(r){
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
        // console.log(buffer)
        await r = buffer
        return buffer
    });
  }
}

async function test()
{
  const addru = new AddressUtilities()
  let r
  await addru.fetch_list(r)
  console.log(r)
}
test()
*/

// const find = spawn('find', ['.', '-type', 'f']);
// const wc = spawn('wc', ['-l']);
// async function test()
// {
//   let arp_cmd = spawn('arp' ,['-a'])
//   arp_cmd.stdout.pipe(wc.stdin);

//   for await (const data of arp_cmd.stdout) {
//     console.log(`number of files: ${data}`);
//   };
// }

// test()

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



// const url = 'ws://192.168.0.85:8081'
// const url = 'ws://10.129.173.122:8081'
const connection = new WebSocket(url)
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
  }
}

connection.onclose = (e)=>{
  clearTimeout(this.pingTimeout);
  console.log("server closed")
  
}