/****************************************************************************
  FileName     [ turnOffLED.cpp ]
  PackageName  [ turnOffLED ]
  Synopsis     [ Send turn off signal to LED strip ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <iostream>
#include <cstdio>
#include <bcm2835.h>
#include <unistd.h>
#include <cstring>
#include "definition.h"

using namespace std;

#define SEND_DELAY  10000

#define START_BYTE  0xFF
#define STOP_BYTE_0 0x55
#define STOP_BYTE_1 0xFF
#define DATA_OFFSET 4

int NUM_LEDS[] = LEDS;

void genColorSeq(uint8_t, uint16_t, char *, const uint16_t &, const uint8_t, const uint8_t, const uint8_t);

int main(int argc, char *argv[])
{
	if (argc != 1)
	{
		cerr << "Invalid parameter\n";
		cerr << "Usage: sudo ./turnOffLED\n";
		return -1;
	}

	if (!bcm2835_init())
	{
		printf("bcm2835_init failed. Are you running as root??\n");
		return 1;
	}
	if (!bcm2835_spi_begin())
	{
		printf("bcm2835_spi_begin failed. Are you running as root??\n");
		return 1;
	}



	// Setup SPI
	bcm2835_spi_setBitOrder(BCM2835_SPI_BIT_ORDER_MSBFIRST);      // The default
	bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);                   // The default
	bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_256);   // div by 256 = 1MHz 
	bcm2835_spi_chipSelect(BCM2835_SPI_CS0);                      // The default
	bcm2835_spi_setChipSelectPolarity(BCM2835_SPI_CS0, LOW);      // the default

	for (uint8_t i = 0; i < NUM_OF_LED; ++i)
	{
		uint16_t dataLen = 6 + 3 * NUM_LEDS[i];
		char test_seq[dataLen + 1];
		genColorSeq(i, NUM_LEDS[i], test_seq, dataLen, 0x00, 0x00, 0x00);
		bcm2835_spi_transfern(test_seq, dataLen);
		usleep(SEND_DELAY);
	}

	printf("done.\n");
	
	// Terminate
	bcm2835_spi_end();
	bcm2835_close();
}

void genColorSeq(uint8_t id, uint16_t numLED, char *seq, const uint16_t &len, const uint8_t r, const uint8_t g, const uint8_t b)
{
	seq[0] = START_BYTE;
	seq[1] = id;
	seq[2] = numLED >> 8;
	seq[3] = numLED;
	for (uint16_t i = 0 ; i < numLED; ++i)
	{
		seq[3 * i + DATA_OFFSET] = r;
		seq[3 * i + DATA_OFFSET + 1] = g;
		seq[3 * i + DATA_OFFSET + 2] = b;
	}
	seq[len - 2] = STOP_BYTE_0;
	seq[len - 1] = STOP_BYTE_1;
}
