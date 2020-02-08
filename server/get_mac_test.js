const os = require('os');
const spawn =  require('child_process').spawn
const SERVER_MAC = "8c:85:90:d1:41:dc"

let arp_cmd = spawn('arp' ,['-a'])
let buffer = ''
arp_cmd.stdout.on('data', function (data) {
    buffer += data;
    // 8c:85:90:d1:41:dc
});

arp_cmd.on('close', function(code){
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

});
