#ifndef NTP_MGR
#define NTP_MGR
#define NTP_PACKET_SIZE 48
#include <WiFiUdp.h> 
#include <ESP8266WiFi.h>


class NTPManager
{
private:
    unsigned int localPort=2390;   //local port to listen for UDP packets
    IPAddress timeServerIP;    //time.nist.gov NTP server address
    const char* ntpServerName="time.google.com"; //NTP Server host name
//    static const int NTP_PACKET_SIZE=48;    // NTP time stamp is in the first 48 bytes of the message
    byte packetBuffer[ NTP_PACKET_SIZE];   //buffer to hold incoming and outgoing packets
    WiFiUDP udp;   //UDP instance to let us send and receive packets over UDP

public:
    NTPManager();
    ~NTPManager();
    void init(){
        Serial.println("Starting UDP");
        udp.begin(localPort);
        Serial.print("Local port: ");
        Serial.println(udp.localPort());
    }
    void sync_clock() {
        unsigned long GMT=getUnixTime();
        Serial.println(GMT);
        // if (GMT != 0) {   //有得到 NTP 回應才更新 ESP8266 內建 RTC
        //     setTime(GMT + 28800L);  //以台灣時間更新內部時鐘
        // } 
    }
    unsigned long getUnixTime() {
        WiFi.hostByName(ntpServerName, timeServerIP);  //get a random server from the pool
        sendNTPpacket(timeServerIP);   //send an NTP packet to a time server
        delay(1000);   // wait to see if a reply is available

        int cb=udp.parsePacket();     //return bytes received
        unsigned long unix_time=0;    //預設傳回 0, 表示未收到 NTP 回應 
        if (!cb) {Serial.println("no packet yet");}
        else {  //received a packet, read the data from the buffer
            Serial.print("packet received, length=");
            Serial.println(cb);    //=48 
            udp.read(packetBuffer, NTP_PACKET_SIZE);  //read the packet into the buffer

            //the timestamp starts at byte 40 of the received packet and is four bytes,
            //or two words, long. First, esxtract the two words:
            unsigned long highWord=word(packetBuffer[40], packetBuffer[41]);
            unsigned long lowWord=word(packetBuffer[42], packetBuffer[43]);
            //combine the four bytes (two words) into a long integer
            //this is NTP time (seconds since Jan 1 1900):
            unsigned long secsSince1900=highWord << 16 | lowWord;
            Serial.print("Seconds since Jan 1 1900=" );
            Serial.println(secsSince1900);
            Serial.print("Unix time=");
            //Unix time starts on Jan 1 1970. In seconds, that's 2208988800:
            unix_time=secsSince1900 - 2208988800UL;    //更新 unix_time
            Serial.print(F("Unix time stamp (seconds since 1970-01-01)="));
            Serial.println(unix_time); //print Unix time
            }   
        return unix_time; //return seconds since 1970-01-01
    }
    unsigned long sendNTPpacket(IPAddress& address) {
        Serial.println("sending NTP packet...");
        // set all bytes in the buffer to 0
        memset(packetBuffer, 0, NTP_PACKET_SIZE);
        //Initialize values needed to form NTP request
        //(see URL above for details on the packets)
        packetBuffer[0]=0b11100011;   // LI, Version, Mode
        packetBuffer[1]=0;     // Stratum, or type of clock
        packetBuffer[2]=6;     // Polling Interval
        packetBuffer[3]=0xEC;  // Peer Clock Precision
        //8 bytes of zero for Root Delay & Root Dispersion
        packetBuffer[12]=49;
        packetBuffer[13]=0x4E;
        packetBuffer[14]=49;
        packetBuffer[15]=52;
        // all NTP fields have been given values, now
        // you can send a packet requesting a timestamp:
        udp.beginPacket(address, 123); //NTP requests are to port 123
        udp.write(packetBuffer, NTP_PACKET_SIZE);
        udp.endPacket();
    }

};




#endif
