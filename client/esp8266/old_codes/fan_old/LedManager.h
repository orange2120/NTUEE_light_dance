#ifndef LED_MANAGER
#define LED_MANAGER

#include <FastLED.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define NUM_LEDS 96
#define DATA_PIN 0

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

   void play() {
      show_frame();
      playing = true;
      begin_time = playing_time = millis();
   }
   void pause() {}
   void upload() {}

   void show_frame(){
      int counter = 0;
      double alpha = 0;

      const char* name = led_json["timeline"][frame_idx]["name"];
      alpha = led_json["timeline"][frame_idx]["alpha"];

      for(int j = 0; j < NUM_LEDS; j++) {
         for(int k = 0; k < 3; ++k){
            leds[j][k] = (int)((int)led_json["picture"][name][counter] * alpha);
            counter++;
         }
      }

      #ifdef DEBUG
      Serial.println(name);
      #endif // DEBUG

      FastLED.show();
   }

   void loop() {
      if(playing){
         playing_time = millis() - begin_time;
         if(frame_idx == led_json["timeline"].size() - 1) {}
         else if(playing_time > led_json["timeline"][frame_idx + 1]["Start"]){
            ++frame_idx;
            show_frame();
         }
      }
   }
private:
   CRGB leds[NUM_LEDS];
   StaticJsonDocument<20000> led_json;
   DeserializationError error;

   unsigned long begin_time;
   unsigned long playing_time;

   unsigned short frame_idx;
   bool playing;
};

#endif // LED_MANAGER