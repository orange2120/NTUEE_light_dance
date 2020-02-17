/****************************************************************************
  FileName     [ SPIWS2812_STM32.ino ]
  PackageName  [ Arduino ]
  Synopsis     [ SPI to WS2812 LED light strip Arduino program ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <FastLED.h>
#include <SPI.h>

#define DEBUG

#define NUM_STRIPS  4
#define COLOR_ORDER GRB
#define LED_TYPE    WS2812

#define BUF_SIZE    1023
#define DATA_OFFSET 4
#define START_BYTE  0xFF
#define STOP_BYTE   0xFF

const uint16_t NUM_LEDS[] = {88, 300, 36, 36};
#define LED_PIN_0   PB0
#define LED_PIN_1   PB1
#define LED_PIN_2   PB2
#define LED_PIN_3   PB3

volatile uint16_t cnt = 0;
volatile bool received(false);      // handle SPI received event flag

CRGB *strips[NUM_STRIPS];

byte buf[BUF_SIZE + 1];

/*
void spiHandler()
{
    lastData = receivedData;
    receivedData = SPI.read();; // data received from master

    buf[cnt++] = receivedData; // add data to buffer
    if (receivedData == STOP_BYTE && lastData == STOP_BYTE) // stop signal
        received = true;       // set received flag
}
*/

uint32_t now = 0;
uint32_t lasttime = 0;

void dataReceiveHandler()
{
    // SPI.dmaTransferSet(NULL, buf);
#ifdef DEBUG
    Serial1.println("sss");
    // Serial1.println(buf[0], HEX);
#endif

    SPI.read(buf , BUF_SIZE);

    Serial1.println("rec");


    // if (buf[0] == START_BYTE)
    //     sendToStrip();

    // cleanBuf();
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
    Serial1.println(cnt);
    // Serial1.println(ID);
    // Serial1.println(numLED);
#endif

    for (uint16_t i = 0; i < numLED; ++i) // send pixel data to LED
    {
        strips[ID][i].setRGB(buf[3 * i + DATA_OFFSET], buf[3 * i + DATA_OFFSET + 1], buf[3 * i + DATA_OFFSET + 2]);
    }
    FastLED.show(); // render
}


void setupSPI()
{
    pinMode(BOARD_SPI_DEFAULT_SS, INPUT); // SS

    // SPI1 is selected by default
    SPI.beginTransactionSlave(SPISettings(0, MSBFIRST, SPI_MODE0, DATA_SIZE_8BIT));
    // SPI.onReceive(dataReceiveHandler);
    // Clear RX register in case we already received SPI data
    // spi_rx_reg(SPI.dev());    
}

void setup()
{
#ifdef DEBUG
    Serial1.begin(115200);
#endif

    // for (uint8_t i = 0; i < NUM_STRIPS; ++i)
    //     strips[i] = new CRGB[NUM_LEDS[i]];

    // FastLED.addLeds<LED_TYPE, LED_PIN_0, COLOR_ORDER>(strips[0], NUM_LEDS[0]);
    // FastLED.addLeds<LED_TYPE, LED_PIN_1, COLOR_ORDER>(strips[1], NUM_LEDS[1]);
    // FastLED.addLeds<LED_TYPE, LED_PIN_2, COLOR_ORDER>(strips[2], NUM_LEDS[2]);
    // FastLED.addLeds<LED_TYPE, LED_PIN_3, COLOR_ORDER>(strips[3], NUM_LEDS[3]);

    setupSPI();
}

void loop()
{
    now = millis();
    if (now - lasttime >= 500)
    {
        // dataReceiveHandler();
        Serial1.println(buf[3], HEX);
        lasttime = now;
    }
}
