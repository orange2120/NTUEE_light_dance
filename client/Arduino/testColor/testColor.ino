/****************************************************************************
  FileName     [ testColor.ino ]
  PackageName  [ Arduino ]
  Synopsis     [ LED strip RGB color test program ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include "Adafruit_NeoPixel.h"

#define NUM_LEDS 10
#define LED_PIN  8
#define COLOR_ORDER NEO_GRB
#define DATA_RATE   NEO_KHZ800

#define R_POT A0
#define G_POT A1
#define B_POT A2

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, COLOR_ORDER + DATA_RATE);;

void setup()
{
    Serial.begin(115200);

    strip.begin();
}

void loop()
{
    uint8_t r = map(analogRead(R_POT), 0, 1023, 0, 255);
    uint8_t g = map(analogRead(G_POT), 0, 1023, 0, 255);
    uint8_t b = map(analogRead(B_POT), 0, 1023, 0, 255);

    String str = "(" + String(r) + ", " + String(g) + ", " + String(b) + ")\n";
    Serial.print(str);

    for (uint8_t i = 0; i < NUM_LEDS; ++i)
    {
        strip.setPixelColor(i, strip.Color(r, g, b));
    }
    strip.show();
    // delay(50);
}