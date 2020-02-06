
// client.js
const fs = require('fs')
const WebSocket = require('ws')
const os = require('os')
// const url = 'ws://localhost:8081'
// const url = 'ws://192.168.1.6:8081'

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
async function test()
{
  let arp_cmd = spawn('arp' ,['-a'])
  arp_cmd.stdout.pipe(wc.stdin);

  for await (const data of arp_cmd.stdout) {
    console.log(`number of files: ${data}`);
  };
}

test()





const url = 'ws://192.168.0.85:8081'
// const url = 'ws://10.129.173.122:8081'
const connection = new WebSocket(url)
 
connection.onopen = () => {
  let response_msg ={
    type :  "request_to_join"
  }
  connection.send(JSON.stringify(response_msg)) 
}
 
connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}
 
connection.onmessage = (e) => {
  console.log(e.data)
  let msg = JSON.parse(e.data)

  if(msg.type === "upload" ){
    fs.writeFileSync('recieve.json', JSON.stringify(msg.data));
    console.log("Done")
  }
}

connection.onclose = (e)=>{
  console.log("server closed")
}