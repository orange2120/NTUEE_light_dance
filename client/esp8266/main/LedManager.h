#ifndef LED_MANAGER
#define LED_MANAGER

#include <FastLED.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define NUM_LEDS 96
#define DATA_PIN 0

#define DEBUG

class LedManager{
public:
   LedManager():begin_time(0), playing_time(0), playing(false) {}
   ~LedManager() {}

   void init() {
      FastLED.addLeds<WS2852, DATA_PIN, GRB>(leds, NUM_LEDS);  // GRB ordering is typical
   }

   bool parsing_json(const char* data){
      error = deserializeJson(led_json, data);
      if (error) {
         Serial.println("Parsing Error: Pic map");
         Serial.println(error.c_str());
         delay(1000);
         return false;
      }
      return true;
   }

   void load(const StaticJsonDocument<200>& doc){
      led_json = doc;
      
   }

   void play() {
      frame_idx = 0;
      show_frame();
      playing = true;
      begin_time = playing_time = millis();
   }
   void pause() {
      playing = false;
   }
   void upload() {}

   void show_frame(){
      int counter = 0;
      double alpha = 0;

      const char* name = led_json["data"]["timeline"][frame_idx]["name"];
      alpha = led_json["data"]["timeline"][frame_idx]["alpha"];

      for(int j = 0; j < NUM_LEDS; j++) {
         for(int k = 0; k < 3; ++k){
            leds[j][k] = (int)((int)led_json["data"]["picture"][name][counter] * alpha);
            counter++;
         }
      }
      Serial.println("show frame");
      Serial.println(name);
      #ifdef DEBUG
      //Serial.println(name);
      #endif // DEBUG

      FastLED.show();
   }

   void loop() {
      if(playing){
         playing_time = millis() - begin_time;
         if(frame_idx == led_json["data"]["timeline"].size() - 1) {}
         else if(playing_time > led_json["data"]["timeline"][frame_idx + 1]["Start"]){
            ++frame_idx;
            show_frame();
         }
      }
   }

   const StaticJsonDocument<20000>& getDoc(){
      return led_json;
   }

private:
   CRGB leds[NUM_LEDS];
   StaticJsonDocument<33772> led_json;
//   DynamicJsonDocument led_json(23511);
   DeserializationError error;

   unsigned long begin_time;
   unsigned long playing_time;

   unsigned short frame_idx;
   bool playing;
};

#endif // LED_MANAGER
