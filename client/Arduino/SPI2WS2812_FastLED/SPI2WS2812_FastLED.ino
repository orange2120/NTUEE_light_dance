/****************************************************************************
  FileName     [ SPIWS2812_FastLED.ino ]
  PackageName  [ Arduino ]
  Synopsis     [ SPI to WS2812 LED light strip Arduino program using FastLED library ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <SPI.h>
#include <FastLED.h>

// #define DEBUG

#define NUM_STRIPS  4
#define COLOR_ORDER GRB
#define LED_TYPE    WS2812

#define BUF_SIZE    1024
#define DATA_OFFSET 4
#define START_BYTE  0xFF
#define STOP_BYTE_1 0x55
#define STOP_BYTE_2 0xFF

const uint16_t NUM_LEDS[] = {88, 300, 36, 36};
const uint8_t LED_PIN[]  = {8, 6, 7, 5};
#define LED_PIN_0   8
#define LED_PIN_1   6
#define LED_PIN_2   7
#define LED_PIN_3   5

volatile uint16_t cnt = 0;
volatile bool received;      // handle SPI received event flag
volatile byte receivedData;  // received SPI data
volatile byte lastData;      // last received data

byte buf[BUF_SIZE];

CRGB *strips[NUM_STRIPS];
CRGB strip_0[88];
CRGB strip_1[300];
CRGB strip_2[36];
CRGB strip_3[36];

void setup()
{
#ifdef DEBUG
    Serial.begin(115200);
#endif
    strips[0] = strip_0;
    strips[1] = strip_1;
    strips[2] = strip_2;
    strips[3] = strip_3;

    FastLED.addLeds<LED_TYPE, LED_PIN_0, COLOR_ORDER>(strips[0], NUM_LEDS[0]);
    FastLED.addLeds<LED_TYPE, LED_PIN_1, COLOR_ORDER>(strips[1], NUM_LEDS[1]);
    FastLED.addLeds<LED_TYPE, LED_PIN_2, COLOR_ORDER>(strips[2], NUM_LEDS[2]);
    FastLED.addLeds<LED_TYPE, LED_PIN_3, COLOR_ORDER>(strips[3], NUM_LEDS[3]);

    // reset all strips
    for (uint8_t i = 0; i < NUM_STRIPS; ++i)
    {
        for (uint16_t j = 0; j < NUM_LEDS[i]; ++j)
        {
            strips[i][j].setRGB(0, 0, 0);
        }
    }
    FastLED.show();

    SPCR |= _BV(SPE); // Turn on SPI in Slave Mode
    received = false;
    SPI.attachInterrupt();    // Interuupt ON is set for SPI commnucation

#ifdef DEBUG
    Serial.println("init done.");
#endif

}

void loop()
{
    if (received)
    {

#ifdef DEBUG
        // Serial.println("received!");
#endif
        delay(5);

        if (buf[0] == START_BYTE)
            sendToStrip();

        received = false;
        cleanBuf();
    }
}

// Inerrrput vector for SPI slave
ISR (SPI_STC_vect)
{
    lastData = receivedData;
    receivedData = SPDR; // data received from master

    buf[cnt++] = receivedData; // add data to buffer
    if (receivedData == STOP_BYTE_2 && lastData == STOP_BYTE_1) // stop signal
        received = true;       // set received flag
}

// clean buffer
inline void cleanBuf()
{
    cnt = 0;
    memset(buf, 0x00, sizeof(char) * BUF_SIZE);
}

void sendToStrip()
{
    uint8_t ID = buf[1]; // strip ID
    uint16_t numLED = (buf[2] << 8) | buf[3]; // number of LEDs in strip

#ifdef DEBUG
    Serial.println(cnt);
    // Serial.println(ID);
    // Serial.println(numLED);
#endif

    for (uint16_t i = 0; i < numLED; ++i) // send pixel data to LED
    {
        strips[ID][i].setRGB(buf[3 * i + DATA_OFFSET], buf[3 * i + DATA_OFFSET + 1], buf[3 * i + DATA_OFFSET + 2]);
    }
    FastLED.show(); // render
}