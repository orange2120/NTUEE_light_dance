/*
 *WebSocketClient.ino
 *
 *Created on: 24.05.2015
 *
 */
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>
#include <ArduinoJson.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

// for json msg parsing
StaticJsonDocument<200> doc;
DeserializationError error;

// #define USE_SERIAL Serial1

// parameters
#define WIFI_NAME "TOTOLINK N300RB"
#define WIFI_PWD ""
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
			error = deserializeJson(doc, (char*) payload);
			if (!error)
			{
				String ss = doc["type"];
				Serial.println(ss);
			}
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
			Serial.println("[WSc] get ping\n");
			//            USE_SERIAL.printf("[WSc] get ping\n");
			break;
		case WStype_PONG:
			// answer to a ping we send
			Serial.println("[WSc] get pong\n");
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
}

void loop()
{
	webSocket.loop();
}