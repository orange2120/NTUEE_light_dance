/****************************************************************************
  FileName     [ SPI_comm.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ SPI communication protocol routines ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

SPI_comm::SPI_comm()
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

~SPI_comm::SPI_comm()
{
    bcm2835_spi_end();
	bcm2835_close();
}

void SPI_comm::send(uint16_t &len, const char *seq)
{
    bcm2835_spi_transfern(seq, len);
}