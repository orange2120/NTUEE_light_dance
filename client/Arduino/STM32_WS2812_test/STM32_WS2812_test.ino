/****************************************************************************
  FileName     [ STM32_WS2812_test.ino ]
  PackageName  [ Arduino ]
  Synopsis     [ WS2812 LED strip test program on STM32F103 platform  ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <FastLED.h>

#define LED_ID  1  // LED strip ID to test

const uint16_t NUM_LEDS[] = {88, 300, 36, 36};

#define COLOR_ORDER GRB
#define LED_TYPE    WS2812

#define NUM_STRIPS  4

CRGB *strips[NUM_STRIPS];

#define LED_PIN_0 PB0
#define LED_PIN_1 PB1
#define LED_PIN_2 PB2
#define LED_PIN_3 PB3

void setup()
{
for (uint8_t i = 0; i < NUM_STRIPS; ++i)
        strips[i] = new CRGB[NUM_LEDS[i]];

    FastLED.addLeds<LED_TYPE, LED_PIN_0, COLOR_ORDER>(strips[0], NUM_LEDS[0]);
    FastLED.addLeds<LED_TYPE, LED_PIN_1, COLOR_ORDER>(strips[1], NUM_LEDS[1]);
    FastLED.addLeds<LED_TYPE, LED_PIN_2, COLOR_ORDER>(strips[2], NUM_LEDS[2]);
    FastLED.addLeds<LED_TYPE, LED_PIN_3, COLOR_ORDER>(strips[3], NUM_LEDS[3]);

}

void loop()
{
    for (int i = 0; i < NUM_LEDS[LED_ID]; ++i)
    {
        strips[LED_ID][i] = CRGB(0, 0, 8);
    }
    FastLED.show();
    delay(500);
    for (int i = 0; i < NUM_LEDS[LED_ID]; ++i)
    {
        strips[LED_ID][i] = CRGB(0, 8, 0);
    }
    FastLED.show();
    delay(500);
    for (int i = 0; i < NUM_LEDS[LED_ID]; ++i)
    {
        strips[LED_ID][i] = CRGB(8, 0, 0);
    }
    FastLED.show();
    delay(500);

    for (int i = 0; i < 255; ++i)
    {
        for (int j = 0; j < NUM_LEDS[LED_ID]; ++j)
        {
            strips[LED_ID][j] = CRGB(i, 0, 0);
        }
        FastLED.show();
        delay(50);
    }
    for (int i = 0; i < 255; ++i)
    {
        for (int j = 0; j < NUM_LEDS[LED_ID]; ++j)
        {
            strips[LED_ID][j] = CRGB(0, i, 0);
        }
        FastLED.show();
        delay(50);
    }
    for (int i = 0; i < 255; ++i)
    {
        for (int j = 0; j < NUM_LEDS[LED_ID]; ++j)
        {
            strips[LED_ID][j] = CRGB(0, 0, i);
        }
        FastLED.show();
        delay(50);
    }
    delay(500);
}