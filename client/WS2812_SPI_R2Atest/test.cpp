#include <iostream>
#include <cstdio>
#include <bcm2835.h>
#include <unistd.h>

using namespace std;

#define TEST_TIMES 5

#define COLOR1 0xFFEE00
#define COLOR2 0x11EE22

#define STOP_BYTE 0xFF
#define LED_ID 0x01
#define NUM_LED 24

void genColorSeq(char *, const uint16_t &, const uint8_t, const uint8_t, const uint8_t);

int main()
{
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

	uint32_t len = 1024;
	uint16_t dataLen = 4 + 3 * NUM_LED;
	char test_seq[dataLen];

	// Setup SPI
	bcm2835_spi_setBitOrder(BCM2835_SPI_BIT_ORDER_MSBFIRST);      // The default
	bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);                   // The default
	bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_32);    // div by 32 = 7.8125MHz 
	bcm2835_spi_chipSelect(BCM2835_SPI_CS0);                      // The default
	bcm2835_spi_setChipSelectPolarity(BCM2835_SPI_CS0, LOW);      // the default
	
	// for (int i = 0; i < TEST_TIMES; ++i)
	// {
		cout << "Send color 1..." << endl;
		genColorSeq(test_seq, dataLen, 0xFF, 0xFF, 0xFF); // color #FFFFFF
		bcm2835_spi_transfern(test_seq, len);
		// sleep(1);
		cout << "Send color 2..." << endl;
		genColorSeq(test_seq, dataLen, 0xAA, 0xAA, 0xAA); // color #AAAAAA
		bcm2835_spi_transfern(test_seq, len);
		// sleep(1);
	// }

	cout << "Test done." << endl;
	
	// Terminate
	bcm2835_spi_end();
	bcm2835_close();
}

void genColorSeq(char *seq, const uint16_t &len, const uint8_t r, const uint8_t g, const uint8_t b)
{
	seq[0] = LED_ID;
	seq[1] = NUM_LED >> 8;
	seq[2] = NUM_LED;
	for (uint16_t i = 0 ; i < NUM_LED; ++i)
	{
		seq[3 * i] = r;
		seq[3 * i + 1] = g;
		seq[3 * i + 2] = b;
	}
	seq[len - 1] = 0xFF;
}