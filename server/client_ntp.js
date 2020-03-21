var ntpClient = require('ntp-client');
 
ntpClient.getNetworkTime("192.168.1.6", 1230, function(err, date) {
    if(err) {
        console.error(err);
        return;
    }
 
    console.log("Current time : ");
    console.log(date)
    console.log(date.getTime()); // Mon Jul 08 2013 21:31:31 GMT+0200 (Paris, Madrid (heure d’été))
});