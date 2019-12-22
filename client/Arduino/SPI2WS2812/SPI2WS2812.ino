#include <SPI.h>
#include "Adafruit_NeoPixel.h"

// #define DEBUG

#define NUM_STRIPS  5 // total 5 WS2812 strips
#define COLOR_ORDER NEO_GRB
#define DATA_RATE   NEO_KHZ800

#define BUF_SIZE    512
#define DATA_OFFSET 4
#define START_BYTE  0xFF
#define STOP_BYTE   0xFF

const uint8_t NUM_LEDS[] = {22,96,60,36,36};
const uint8_t LED_PIN[]  = {8, 6, 7, 5, 9};

volatile uint16_t cnt = 0;
volatile bool received;      // handle SPI received event flag
volatile byte receivedData;  // received SPI data
volatile byte lastData;      // last received data

byte buf[BUF_SIZE];

Adafruit_NeoPixel *strips[NUM_STRIPS];

void setup()
{
    Serial.begin(115200);

    for (uint8_t i = 0; i < NUM_STRIPS; ++i)
    {
        strips[i] = new Adafruit_NeoPixel(NUM_LEDS[i], LED_PIN[i], COLOR_ORDER + DATA_RATE);
        strips[i]->begin();
        strips[i]->show();
    }

    SPCR |= _BV(SPE); // Turn on SPI in Slave Mode
    received = false;
    SPI.attachInterrupt();    // Interuupt ON is set for SPI commnucation

    Serial.println("init done.");
}

void loop()
{
    if (received)
    {

    #ifdef DEBUG
        Serial.println("received!");
    #endif
        delay(1);

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
    if (receivedData == STOP_BYTE && lastData == STOP_BYTE) // stop signal
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
    Serial.println(ID);
    Serial.println(numLED);
#endif

    for (uint8_t i = 0; i < numLED; ++i) // send pixel data to LED
    {
        #ifdef DEBUG
            String s = String(3 * i + DATA_OFFSET) + " " + String(buf[3 * i + DATA_OFFSET], HEX) + " " +
                       String(buf[3 * i + DATA_OFFSET + 1], HEX) + " " + String(buf[3 * i + DATA_OFFSET + 2], HEX);
            Serial.println(s);
        #endif
        strips[ID]->setPixelColor(i, buf[3 * i + DATA_OFFSET], buf[3 * i + DATA_OFFSET + 1], buf[3 * i + DATA_OFFSET + 2]);
    }
    strips[ID]->show(); // render
}