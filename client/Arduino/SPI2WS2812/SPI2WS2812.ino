#include <SPI.h>
#include "Adafruit_NeoPixel.h"

#define NUM_STRIPS  5 // total 5 WS2812 strips
#define COLOR_ORDER NEO_GRB
#define DATA_RATE   NEO_KHZ800

#define BUF_SIZE 512
#define DATA_OFFSET 3

const uint8_t NUM_LEDS[] = {24,96,60,36,36};
const uint8_t LED_PIN[]  = {8, 6, 7, 5, 9};

volatile uint16_t cnt = 0;
volatile bool received;      // handle SPI received event
volatile byte receivedData;  // received SPI data
volatile byte lastData;      // last received data

char buf[BUF_SIZE];

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
}

void loop()
{
    if (received)
    {
        Serial.println("received!");
        sendToStrip();

        received = false;
        cleanBuf();
    }
}

ISR (SPI_STC_vect)   // Inerrrput vector for SPI
{
    lastData = receivedData;
    receivedData = SPDR; // Value received from master if store in variable slavereceived
    buf[cnt++] = receivedData;
    if (receivedData == 0xFF && lastData == 0xFF) // stop signal
        received = true;       // Data received
}

void DataReceivedHandler()
{

}

inline void cleanBuf()
{
    cnt = 0;
    memset(buf, 0x00, sizeof(char) * BUF_SIZE);
}

void sendToStrip()
{
    uint8_t ID = buf[0]; // strip ID
    uint16_t numLED = (buf[1] << 8) | buf[2];

    Serial.println(cnt);
    Serial.println(ID);
    Serial.println(numLED);

    for (uint8_t i = 0; i < numLED; ++i) // send pixel data to LED
    {
        String s = String(3 * i + DATA_OFFSET) + " " + String(buf[3 * i + DATA_OFFSET], HEX) + " " +
                   String(buf[3 * i + DATA_OFFSET + 1], HEX) + " " + String(buf[3 * i + DATA_OFFSET + 2], HEX);

        Serial.println(s);

        strips[ID]->setPixelColor(i, buf[3 * i + DATA_OFFSET], buf[3 * i + DATA_OFFSET + 1], buf[3 * i + DATA_OFFSET + 2]);
    }
    strips[ID]->show();
}