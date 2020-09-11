// const buffer = require('buffer');
<<<<<<< HEAD
const udp = require("dgram");
// creating a client socket
const client = udp.createSocket("udp4");
let delay = 0;
//buffer msg

client.on("message", function (msg, info) {
  let recieve_timestamp = new Date();

  console.log("Data received from server : " + msg.toString());
  console.log(
    "Received %d bytes from %s:%d\n",
    msg.length,
    info.address,
    info.port
  );
  if (msg.toString().startsWith("{")) {
    let parse_msg = JSON.parse(msg.toString());
    parse_msg.t3 = Math.floor(recieve_timestamp / 1);
    console.log(parse_msg);
    console.log(parse_msg.t1 - parse_msg.t0);
    console.log((parse_msg.t3 - parse_msg.t0) / 2);
    delay = (parse_msg.t3 - parse_msg.t0) / 2;

    const data2 = Buffer.from("re_" + String(delay));
    client.send(data2, 2222, "192.168.1.6", function (error) {
      if (error) {
        client.close();
      } else {
        console.log("request Data sent !!!");
      }
    });
  } else {
    require("child_process").exec(
      "sudo sudo date --set " + msg.toString(),
      function (msg) {
        console.log(msg);
      }
    );
  }

  // if(parse_msg.t3==0)
  // {
  //     parse_msg.t23 = Math.floor(new Date()/1)
  // }else{

  // }
=======
const udp = require('dgram');
// creating a client socket
const client = udp.createSocket('udp4');
let delay = 0
//buffer msg


client.on('message',function(msg,info){
    let recieve_timestamp = new Date()

  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
  if (msg.toString().startsWith('{')) {
    let parse_msg = JSON.parse(msg.toString())
    parse_msg.t3 = Math.floor(recieve_timestamp/1)
    console.log(parse_msg)
    console.log((parse_msg.t1-parse_msg.t0))
    console.log((parse_msg.t3-parse_msg.t0)/2)
    delay = (parse_msg.t3-parse_msg.t0)/2

    const data2 = Buffer.from("re_" + String(delay));
    client.send(data2,2222,'192.168.1.6',function(error){
        if(error){
            client.close();
        }else{
            console.log('request Data sent !!!');
        }
    });
  } else {
    require('child_process').exec('sudo sudo date --set ' + msg.toString(), function (msg) { console.log(msg) });
  }
  


    // if(parse_msg.t3==0)
    // {
    //     parse_msg.t23 = Math.floor(new Date()/1)
    // }else{

    // }
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
  //   require('child_process').exec('sudo sudo date --set ' + msg.toString(), function (msg) { console.log(msg) });
});

//sending msg
// let mytime = new Date()
let msg_json = {
<<<<<<< HEAD
  t0: Math.floor(new Date() / 1),
  t1: 0,
  t2: 0,
  t3: 0,
};
const data1 = Buffer.from(JSON.stringify(msg_json));
client.send(data1, 2222, "192.168.1.6", function (error) {
  if (error) {
    client.close();
  } else {
    console.log("t0 Data sent !!!");
  }
});

=======
    t0:Math.floor(new Date()/1),
    t1:0,
    t2:0,
    t3:0
}
const data1 = Buffer.from(JSON.stringify(msg_json));
client.send(data1,2222,'192.168.1.6',function(error){
  if(error){
    client.close();
  }else{
    console.log('t0 Data sent !!!');
  }
});




>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
// let data1 = Buffer.from('hello');
// let data2 = Buffer.from('world');

// //sending multiple msg
// client.send([data1,data2],2222,'localhost',function(error){
//   if(error){
//     client.close();
//   }else{
//     console.log('Data sent !!!');
//   }
<<<<<<< HEAD
// });
=======
// });
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
