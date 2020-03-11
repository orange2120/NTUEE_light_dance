#ifndef LED_MANAGER
#define LED_MANAGER

#define FASTLED_ESP8266_RAW_PIN_ORDER

#include <FastLED.h>
#include <Arduino.h>
#include <ArduinoJson.h>

#define NUM_LEDS 96
#define LED_ROWS 8
#define LEDS_IN_ROW (NUM_LEDS/LED_ROWS)
#define DATA_PIN 0

// DynamicJsonDocument led_json(43772);
const char* pic_data = "{\
   \"fan_1\": 24,\
   \"fan_2\": 36,\
   \"fan_3\": 66,\
   \"fan_4\": 129,\
   \"fan_all_bright\": 255,\
   \"fan_left1_dark\": 127,\
   \"fan_left2_dark\": 191,\
   \"fan_left3_dark\": 223,\
   \"fan_right1_dark\": 254,\
   \"fan_right2_dark\": 253,\
   \"fan_right3_dark\": 251,\
   \"fan_three\": 126,\
   \"fan_three_noMid\": 231,\
   \"fan_two\": 60,\
   \"fan_two_noMid\": 195,\
   \"bl_fan\": 0\
}";
const CRGB Ocher = {255, 150, 0};

class LedManager{
public:
   LedManager():starting_time(0), playing_time(0), playing(false) {
      error = deserializeJson(pic_json, pic_data);
      if (error) {
         Serial.println("Parsing Error: Pic map");
         Serial.println(error.c_str());
         delay(5000);
      }
   }
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
      uint8_t temp = 0;

      const char* name = led_json["data"]["timeline"][frame_idx]["name"];
      alpha = led_json["data"]["timeline"][frame_idx]["alpha"];
      temp = pic_json[name];

      for(int i = 0; i < LED_ROWS; ++i){
         if((temp>>(7 - i)) % 2 == 1){
            Serial.print("1 ");
            for(int j = 0; j < LEDS_IN_ROW; ++j){
               leds[i*LEDS_IN_ROW + j].r = Ocher.r * alpha;
               leds[i*LEDS_IN_ROW + j].g = Ocher.g * alpha;
               leds[i*LEDS_IN_ROW + j].b = Ocher.b * alpha;
            }
         }
         else{
            Serial.print("0 ");
            for(int j = 0; j < LEDS_IN_ROW; ++j){
               leds[i*LEDS_IN_ROW + j] = CRGB::Black;
            }
         }
      }
      Serial.println();

      /* for(int j = 0; j < NUM_LEDS; j++) {

         leds[j].r = (int)(((unsigned int)led_json["data"]["picture"][name][j]>>16) * alpha);
         leds[j].g = (int)(((unsigned int)led_json["data"]["picture"][name][j]>>8) % 256 * alpha);
         leds[j].b = (int)((unsigned int)led_json["data"]["picture"][name][j] % 256 * alpha);

         // for(int k = 0; k < 3; ++k){
         //    leds[j][k] = (int)((int)led_json["data"]["picture"][name][counter] * alpha);
         //    counter++;
         // }
      } */
      Serial.println("show frame");
      Serial.println(name);
      Serial.print(millis());
      Serial.print(" ");
      Serial.println(playing_time);

      FastLED.show();
   }
   void set_fram_idx(){
      while(!frame_end() && playing_time >= led_json["data"]["timeline"][frame_idx + 1]["Start"])
         ++frame_idx;
      while(frame_idx != 0 && playing_time < led_json["data"]["timeline"][frame_idx]["Start"])
         --frame_idx;
   }
   bool frame_end(){
      if(frame_idx == led_json["data"]["timeline"].size() - 1)
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
   StaticJsonDocument<35000> led_json;
   StaticJsonDocument<450> pic_json;
//   DynamicJsonDocument led_json(43772);
   DeserializationError error;

   unsigned long starting_time;
   unsigned long playing_time;
   unsigned long start_from_witch_time;

   unsigned short frame_idx;
   bool playing;
};

#endif // LED_MANAGER
