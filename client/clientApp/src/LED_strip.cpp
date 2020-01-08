/****************************************************************************
  FileName     [ LED_strip.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ LED strip control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

LED_Strip::LED_Strip(const uint8_t &nStrips,const uint16_t *nLEDs) : _nStrip(nStrips)
{
	_nLEDs = new uint8_t[nStrips];
	for (uint8_t i = 0; i < nStrips; ++i)
		_nLEDs[i] = nLEDs[i];

	// SPI init
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
	char buf[len] = {0};
	getSeq(id, buf, color);
	bcm2835_spi_transfern(test_seq, dataLen);
	// spi.send(dataLen, buf);
}


// get strip pixel secquence
void LED_Strip::getSeq(const uint8_t &id, const uint16_t &len, char *seq,  const char *color)
{
	buf[0] = START_BYTE;
	buf[1] = id;
	buf[2] = _nLEDs[id] >> 8;
	buf[3] = _nLEDs[id];
	for (uint16_t i = 0 ; i < _nLEDs[id]; ++i)
	{
		buf[3 * i + DATA_OFFSET] = color[3 * i];
		buf[3 * i + DATA_OFFSET + 1] = color[3 * i + 1];
		buf[3 * i + DATA_OFFSET + 2] = color[3 * i];
	}
	buf[len - 2] = STOP_BYTE;
	buf[len - 1] = STOP_BYTE;
}