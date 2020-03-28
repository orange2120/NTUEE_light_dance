/*
 *WebSocketClient.ino
 *
 *Created on: 24.05.2015
 *
 */
//#define DEBUG
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <FastLED.h>

#include <ArduinoJson.h>
#include "LedManager.h"

#define HOSTNAME "fan1"
// #include "NTPManager.h"

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
LedManager ledMgr;

//NTPManager ntpMgr;

// for json msg parsing
StaticJsonDocument<90> doc;
DeserializationError error;

#include <WiFiUdp.h>

unsigned int localPort = 2390;				   //local port to listen for UDP packets
IPAddress timeServerIP;						   //time.nist.gov NTP server address
const char *ntpServerName = "time.google.com"; //NTP Server host name
const int NTP_PACKET_SIZE = 48;				   // NTP time stamp is in the first 48 bytes of the message
byte packetBuffer[NTP_PACKET_SIZE];			   //buffer to hold incoming and outgoing packets
WiFiUDP udp;								   //UDP instance to let us send and receive packets over UDP

// #define USE_SERIAL Serial1

// parameters
#define WIFI_NAME "TOTOLINK N300RB"
#define WIFI_NAME2 "MakerSpace_2.4G"
#define WIFI_NAME3 "ronchen21"
#define WIFI_PWD "" //"ntueesaad"
//"ntueesaad"
#define SERVER_IP2 "192.168.0.200"
#define SERVER_IP "192.168.1.6"

#define SERVER_PORT 8081

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

	switch (type)
	{
	case WStype_DISCONNECTED:
		//      USE_SERIAL.printf("[WSc] Disconnected!\n");
		Serial.println("[WSc] Disconnected!\n");
		break;
	case WStype_CONNECTED:

		//      USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
		Serial.println("[WSc] Connected to url: ");
		Serial.println((char *)payload);
		Serial.println();
		// send message to server when Connected
		char str[100];
		snprintf(str, 100, "{\"type\":\"request_to_join\",\"data\":{\"board_type\":\"fan\",\"hostname\":\"%s\"}}", HOSTNAME);
		Serial.println(str);
		webSocket.sendTXT(str);

		break;
	case WStype_TEXT:
		//      USE_SERIAL.printf("[WSc] get text: %s\n", payload);
		Serial.println("[WSc] get text:");
		Serial.println((char *)payload);
		Serial.println();
		Serial.println(*(((char *)payload) + 9));
		Serial.println();
		if (*(((char *)payload) + 9) == 'u')
		{
			ledMgr.pause();
			Serial.println("Get u\n");
			if (!ledMgr.parsing_json((char *)payload))
			{
			}
		}
		else
		{
			error = deserializeJson(doc, (char *)payload);
			String ss = doc["type"];
			if (ss == "play")
			{
				ledMgr.prepare_to_play(doc["data"]["p"]);
				unsigned long tmp_time_diff = getUnixTime();
				Serial.println(tmp_time_diff);
				tmp_time_diff = tmp_time_diff - (unsigned long)(millis() / 1000);
				Serial.println(tmp_time_diff);
				while ((unsigned long)(millis() / 1000) + tmp_time_diff < doc["data"]["sc"])
				{
					webSocket.loop();
				}
				ledMgr.play();
				webSocket.sendTXT("{\"type\":\"ACKc\",\"data\":{\"board_type\":\"fan\",\"ack_type\":\"playing\"}}");
			}
			else if (ss == "pause")
			{
				ledMgr.pause();
				webSocket.sendTXT("{\"type\":\"ACKc\",\"data\":{\"board_type\":\"fan\",\"ack_type\":\"idle\"}}");
			} else {
				webSocket.sendTXT("{\"type\":\"ACKc\",\"data\":{\"board_type\":\"fan\",\"ack_type\":\"cmd_not_exist\"}}");
			}
		}

		break;
	case WStype_BIN:
		Serial.println("[WSc] get binary length");
		Serial.println(length);
		//      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
		hexdump(payload, length);
		Serial.println();

		// send data to server
		// webSocket.sendBIN(payload, length);
		break;
	case WStype_PING:
		// pong will be send automatically
		//			Serial.println("[WSc] get ping\n");
		//            USE_SERIAL.printf("[WSc] get ping\n");
		break;
	case WStype_PONG:
		// answer to a ping we send
		//			Serial.println("[WSc] get pong\n");
		//            USE_SERIAL.printf("[WSc] get pong\n");
		break;
	}
}

void setup()
{
	// USE_SERIAL.begin(921600);
	//  USE_SERIAL.begin(115200);
	Serial.begin(115200);

	//Serial.setDebugOutput(true);
	//  USE_SERIAL.setDebugOutput(true);
	delay(10);
	Serial.println();
	Serial.println();
	//  USE_SERIAL.println();
	//  USE_SERIAL.println();
	//  USE_SERIAL.println();

	for (uint8_t t = 4; t > 0; t--)
	{
		//    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
		//    USE_SERIAL.flush();
		delay(1000);
	}

	WiFiMulti.addAP(WIFI_NAME, WIFI_PWD);

	//WiFi.disconnect();
	while (WiFiMulti.run() != WL_CONNECTED)
	{
		delay(100);
	}
	Serial.println("Ok\n");
	// server address, port and URL
	webSocket.begin(SERVER_IP, SERVER_PORT, "/");

	// event handler
	webSocket.onEvent(webSocketEvent);

	// use HTTP Basic Authorization this is optional remove if not needed
	//  webSocket.setAuthorization("user", "Password");

	// try ever 5000 again if connection has failed
	webSocket.setReconnectInterval(5000);

	// start heartbeat (optional)
	// ping server every 15000 ms
	// expect pong from server within 3000 ms
	// consider connection disconnected if pong is not received 2 times
	webSocket.enableHeartbeat(15000, 3000, 2);

	pinMode(13, INPUT); // Initialize the LED_BUILTIN pin as an output
	delay(10);

	ledMgr.init();
	// if(!ledMgr.parsing_json(jsonData))
	// 	ESP.restart();
	//	ntpMgr.init();
	delay(1000);
	Serial.println("ready");

	Serial.println("Starting UDP");
	udp.begin(localPort);
	Serial.print("Local port: ");
	Serial.println(udp.localPort());

	// ledMgr.play();
}

unsigned long getUnixTime()
{
	WiFi.hostByName(ntpServerName, timeServerIP); //get a random server from the pool
	sendNTPpacket(timeServerIP);				  //send an NTP packet to a time server
	delay(1000);								  // wait to see if a reply is available

	int cb = udp.parsePacket(); //return bytes received
	unsigned long unix_time = 0;
	if (!cb)
	{
		Serial.println("no packet yet");
	}
	else
	{ //received a packet, read the data from the buffer
		Serial.print("packet received, length=");
		Serial.println(cb);						 //=48
		udp.read(packetBuffer, NTP_PACKET_SIZE); //read the packet into the buffer

		//the timestamp starts at byte 40 of the received packet and is four bytes,
		//or two words, long. First, esxtract the two words:
		unsigned long highWord = word(packetBuffer[40], packetBuffer[41]);
		unsigned long lowWord = word(packetBuffer[42], packetBuffer[43]);
		//combine the four bytes (two words) into a long integer
		//this is NTP time (seconds since Jan 1 1900):
		unsigned long secsSince1900 = highWord << 16 | lowWord;
		Serial.print("Seconds since Jan 1 1900=");
		Serial.println(secsSince1900);
		Serial.print("Unix time=");
		//Unix time starts on Jan 1 1970. In seconds, that's 2208988800:
		unix_time = secsSince1900 - 2208988800UL;
		Serial.print(F("Unix time stamp (seconds since 1970-01-01)="));
		Serial.println(unix_time); //print Unix time
	}
	return unix_time; //return seconds since 1970-01-01
}

unsigned long sendNTPpacket(IPAddress &address)
{
	Serial.println("sending NTP packet...");
	// set all bytes in the buffer to 0
	memset(packetBuffer, 0, NTP_PACKET_SIZE); //clear the buffer
	//Initialize values needed to form NTP request
	//(see URL above for details on the packets)
	packetBuffer[0] = 0b11100011; // LI, Version, Mode
	packetBuffer[1] = 0;		  // Stratum, or type of clock
	packetBuffer[2] = 6;		  // Polling Interval
	packetBuffer[3] = 0xEC;		  // Peer Clock Precision
	//8 bytes of zero for Root Delay & Root Dispersion
	packetBuffer[12] = 49;
	packetBuffer[13] = 0x4E;
	packetBuffer[14] = 49;
	packetBuffer[15] = 52;
	// all NTP fields have been given values, now
	// you can send a packet requesting a timestamp:
	udp.beginPacket(address, 123);			  //NTP requests are to port 123
	udp.write(packetBuffer, NTP_PACKET_SIZE); //send UDP request to NTP server
	udp.endPacket();
}

void loop()
{
	webSocket.loop();
	ledMgr.loop();
	// getNTP();
	//   ntpMgr.sync_clock();
	// Serial.println(getUnixTime());
}
