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

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
LedManager ledMgr;

const char* jsonData = "{\"type\":\"upload\",\"data\":{\"picture\":{\"fan_1\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"fan_2\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,255,150,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"bl_fan\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},\"timeline\":[{\"Start\":0,\"name\":\"fan_1\",\"alpha\":1},{\"Start\":1000,\"name\":\"fan_2\",\"alpha\":0.5},{\"Start\":2000,\"name\":\"bl_fan\",\"alpha\":0}]}}";


// for json msg parsing
StaticJsonDocument<90> doc;
DeserializationError error;

// #define USE_SERIAL Serial1

// parameters
#define WIFI_NAME1 "TOTOLINK N300RB"
#define WIFI_NAME "MakerSpace_2.4G"
#define WIFI_PWD "ntueesaad" 
//"ntueesaad"
#define SERVER_IP1 "192.168.1.6"
#define SERVER_IP "192.168.0.89"

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
			Serial.println((char*) payload);
			Serial.println();
			// send message to server when Connected
			webSocket.sendTXT("{\"type\":\"request_to_join\",\"data\":{\"board_type\":\"fan\"}}");
      
			break;
		case WStype_TEXT:
			//      USE_SERIAL.printf("[WSc] get text: %s\n", payload);
			Serial.println("[WSc] get text:");
			Serial.println((char*) payload);
      Serial.println();
      Serial.println(*(((char*)payload)+9));
      Serial.println();
      if(    *(((char*)payload)+9) == 'u'){
        ledMgr.pause();
        Serial.println("Get u\n");
        if (!ledMgr.parsing_json((char*) payload))
        {
          
        }
      }else{
        error = deserializeJson(doc, (char*) payload);
        String ss = doc["type"];
        if(ss=="play"){
          ledMgr.play(doc["data"]["p"]);
        }else if(ss=="pause"){
          ledMgr.pause();
        }
      }
      

      		
			 
			
//			if (!ledMgr.parsing_json((char*) payload))
//			{
//				
//				String ss = ledMgr.getDoc()["type"];
//        Serial.println("type"); 
//        Serial.println(ss); 
////        unsigned long color = doc["color"];
//        if(ss=="play"){
//          ledMgr.play();
//        }else if(ss=="pause"){
//          ledMgr.pause();
//        }else if(ss=="upload"){
////          const char * pp = 
//        //   ledMgr.parsing_json((char*) payload);
//		//   ledMgr.load(doc);
//		  Serial.println("get upload");
//		//   doc["data"]
//        }
//
//				
////       Serial.println(color);
//			}
			// send message to server
			// webSocket.sendTXT("message here");
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

	WiFiMulti.addAP(WIFI_NAME,WIFI_PWD);

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

	pinMode(13, INPUT);   // Initialize the LED_BUILTIN pin as an output
   	delay(10);

	ledMgr.init();
	// if(!ledMgr.parsing_json(jsonData))
	// 	ESP.restart();

	delay(1000);
	Serial.println("ready");
  	// ledMgr.play();
	

}

void loop()
{
	webSocket.loop();
	ledMgr.loop();
  
}
