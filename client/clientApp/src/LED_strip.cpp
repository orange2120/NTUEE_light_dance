/****************************************************************************
  FileName     [ LED_strip.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ LED strip control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

LED_Strip::LED_Strip(const uint8_t &nStrips,const uint8_t *nLEDs) : _nStrip(nStrips)
{
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

    delete nLEDs;
}

// send strip pixel secquence
void LED_Strip::sendSeq(const uint8_t &id, const char *seq)
{
	char buf[3 * _nLEDs[id] + 5] = {0};
	buf[0] = id;
	buf[1] = 

}