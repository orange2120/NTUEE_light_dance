/****************************************************************************
  FileName     [ SPIWS2812.ino ]
  PackageName  [ Arduino ]
  Synopsis     [ SPI to WS2812 LED light strip Arduino program using Adafruit NeoPixel library]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <SPI.h>
#include "Adafruit_NeoPixel.h"

// #define DEBUG

#define NUM_STRIPS  4
#define COLOR_ORDER NEO_GRB
#define DATA_RATE   NEO_KHZ800

#define BUF_SIZE    1024
#define DATA_OFFSET 4
#define START_BYTE  0xFF
#define STOP_BYTE_1 0x55
#define STOP_BYTE_2 0xFF

const uint16_t NUM_LEDS[] = {300, 40, 40, 88};
const uint8_t LED_PIN[]  = {30, 31, 29, 27};

volatile uint16_t cnt = 0;
volatile bool received;      // handle SPI received event flag
volatile byte receivedData;  // received SPI data
volatile byte lastData;      // last received data

byte buf[BUF_SIZE];

Adafruit_NeoPixel strips[NUM_STRIPS];

void setup()
{
#ifdef DEBUG
    Serial.begin(115200);
#endif
    strips[0] = Adafruit_NeoPixel(NUM_LEDS[0], LED_PIN[0], COLOR_ORDER + DATA_RATE);
    strips[1] = Adafruit_NeoPixel(NUM_LEDS[1], LED_PIN[1], COLOR_ORDER + DATA_RATE);
    strips[2] = Adafruit_NeoPixel(NUM_LEDS[2], LED_PIN[2], COLOR_ORDER + DATA_RATE);
    strips[3] = Adafruit_NeoPixel(NUM_LEDS[3], LED_PIN[3], COLOR_ORDER + DATA_RATE);

    for (uint8_t i = 0; i < NUM_STRIPS; ++i)
    {
        strips[i].begin();
        strips[i].show();
    }

    for (uint8_t i = 0; i < NUM_STRIPS; ++i)
    {
        for (uint16_t j = 0; j < NUM_LEDS[i]; ++j)
            strips[i].setPixelColor(j, 0, 0, 0);
        strips[i].show();
    }

    // pinMode(SS,INPUT);
    SPCR |= _BV(SPE); // Turn on SPI in Slave Mode
    SPCR |= _BV(SPIE); // get ready for an interrupt 
    received = false;
    SPI.attachInterrupt();    // Interrupt ON is set for SPI commnucation

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
        delay(2);

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
        strips[ID].setPixelColor(i, buf[3 * i + DATA_OFFSET], buf[3 * i + DATA_OFFSET + 1], buf[3 * i + DATA_OFFSET + 2]);
    }
    strips[ID].show(); // render
}