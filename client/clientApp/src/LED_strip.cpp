/****************************************************************************
  FileName     [ LED_strip.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ LED strip control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/
#include "LED_strip.h"

LED_Strip::LED_Strip(const uint8_t &nStrips,const uint16_t *nLEDs) : _nStrips(nStrips)
{
	_nLEDs = new uint8_t[nStrips];
	for (uint8_t i = 0; i < nStrips; ++i)
		_nLEDs[i] = nLEDs[i];

	// SPI init
    if (!bcm2835_init())
	{
		printf("bcm2835_init failed. Are you running as root??\n");
		return;
	}
	if (!bcm2835_spi_begin())
	{
		printf("bcm2835_spi_begin failed. Are you running as root??\n");
		return;
	}

    bcm2835_spi_setBitOrder(BCM2835_SPI_BIT_ORDER_MSBFIRST);
	bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);
	bcm2835_spi_setClockDivider(SPI_CLOCK_DIV);
	bcm2835_spi_chipSelect(BCM2835_SPI_CS0);
	bcm2835_spi_setChipSelectPolarity(BCM2835_SPI_CS0, LOW);
}

LED_Strip::~LED_Strip()
{
	bcm2835_spi_end();
	bcm2835_close();

    delete _nLEDs;
}

// send strip pixel secquence
void LED_Strip::sendToStrip(const uint8_t &id, const char *color)
{
	uint16_t dataLen = 3 * _nLEDs[id] + 6; // data length = 3n + 6
	char buf[dataLen] = {0};
	getSeq(id, dataLen, buf, color);
	bcm2835_spi_transfern(buf, dataLen);
	// spi.send(dataLen, buf);
}


// get strip pixel secquence
void LED_Strip::getSeq(const uint8_t &id, const uint16_t &len, char *seq,  const char *color)
{
	seq[0] = START_BYTE;
	seq[1] = id;
	seq[2] = _nLEDs[id] >> 8;
	seq[3] = _nLEDs[id];
	for (uint16_t i = 0 ; i < _nLEDs[id]; ++i)
	{
		seq[3 * i + DATA_OFFSET] = color[3 * i];
		seq[3 * i + DATA_OFFSET + 1] = color[3 * i + 1];
		seq[3 * i + DATA_OFFSET + 2] = color[3 * i];
	}
	seq[len - 2] = STOP_BYTE;
	seq[len - 1] = STOP_BYTE;
}