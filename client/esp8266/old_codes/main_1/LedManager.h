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
   \"fan_1\": 536,\
   \"fan_2\": 548,\
   \"fan_3\": 578,\
   \"fan_4\": 641,\
   \"fan_all_bright\": 767,\
   \"fan_all_pink\": 255,\
   \"fan_all_red\": 511,\
   \"fan_left1_dark\": 639,\
   \"fan_left2_dark\": 703,\
   \"fan_left3_dark\": 735,\
   \"fan_right1_dark\": 766,\
   \"fan_right2_dark\": 765,\
   \"fan_right3_dark\": 763,\
   \"fan_three\": 638,\
   \"fan_three_noMid\": 743,\
   \"fan_two\": 572,\
   \"fan_two_noMid\": 707,\
   \"bl_fan\": 0\
}";
const CRGB Pink = {255, 0, 43};
const CRGB Red = {255, 0, 0};
const CRGB Dark_Red = {125, 0, 0};

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
   void prepare_to_play(unsigned long s_time = 0) {
      Serial.println("play from");
      Serial.println(s_time);
      
      playing_time = start_from_witch_time = s_time;
      set_fram_idx();



      
   }
   void play() {
      Serial.println("Start Playing");
      show_frame();
      starting_time = millis();
      playing = true;
   }
   void pause() {
      playing = false;
   }
   void upload() {}

   void show_frame(){
      const char* name = led_json["data"]["timeline"][frame_idx]["name"];
      double alpha = led_json["data"]["timeline"][frame_idx]["alpha"];
      int temp = pic_json[name];
      CRGB color;

      switch (temp>>8) {
         case 0: color = Pink; break;
         case 1: color = Red; break;
         case 2: color = Dark_Red; break;
         default: color = CRGB::Green; break;
      }

      for(int i = 0; i < LED_ROWS; ++i){
         if((temp>>(i)) % 2 == 1){
            Serial.print("1 ");
            for(int j = 0; j < LEDS_IN_ROW; ++j){
               leds[i*LEDS_IN_ROW + j].r = color.r * alpha;
               leds[i*LEDS_IN_ROW + j].g = color.g * alpha;
               leds[i*LEDS_IN_ROW + j].b = color.b * alpha;
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
         playing_time = millis() - starting_time + start_from_witch_time;
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
