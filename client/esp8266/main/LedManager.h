#ifndef LED_MANAGER
#define LED_MANAGER

#define FASTLED_ESP8266_RAW_PIN_ORDER

#include <FastLED.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define NUM_LEDS 96
#define DATA_PIN 0

#define DEBUG
DynamicJsonDocument led_json(43772);

class LedManager{
public:
   LedManager():starting_time(0), playing_time(0), playing(false) {}
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

   void play(unsigned long s_time = 0) {
      Serial.println("play from");
      Serial.println(s_time);
      starting_time = millis();
      playing_time = start_from_witch_time = s_time;
      
      
      set_fram_idx();
      show_frame();
      playing = true;
   }
   void pause() {
      playing = false;
   }
   void upload() {}

   void show_frame(){
      double alpha = 0;

      const char* name = led_json["data"]["timeline"][frame_idx]["name"];
      alpha = led_json["data"]["timeline"][frame_idx]["alpha"];

      for(int j = 0; j < NUM_LEDS; j++) {

         leds[j].r = (int)(((unsigned int)led_json["data"]["picture"][name][j]>>16) * alpha);
         leds[j].g = (int)(((unsigned int)led_json["data"]["picture"][name][j]>>8) % 256 * alpha);
         leds[j].b = (int)((unsigned int)led_json["data"]["picture"][name][j] % 256 * alpha);

         // for(int k = 0; k < 3; ++k){
         //    leds[j][k] = (int)((int)led_json["data"]["picture"][name][counter] * alpha);
         //    counter++;
         // }
      }
      Serial.println("show frame");
      Serial.println(name);
      #ifdef DEBUG
      //Serial.println(name);
      #endif // DEBUG

      FastLED.show();
   }
   void set_fram_idx(){
      while(!frame_end() && playing_time >= led_json["timeline"][frame_idx + 1]["Start"])
         ++frame_idx;
      while(frame_idx != 0 && playing_time < led_json["timeline"][frame_idx]["Start"])
         --frame_idx;
   }
   bool frame_end(){
      if(frame_idx == led_json["timeline"].size() - 1)
         return true;
      else
         return false;
   }
   void loop() {
      if(playing){
         playing_time = millis() - starting_time;
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
//   StaticJsonDocument<43772> led_json;
//   DynamicJsonDocument led_json(43772);
   DeserializationError error;

   unsigned long starting_time;
   unsigned long playing_time;
   unsigned long start_from_witch_time;

   unsigned short frame_idx;
   bool playing;
};

#endif // LED_MANAGER
