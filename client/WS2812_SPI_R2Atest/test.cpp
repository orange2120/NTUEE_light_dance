#include <iostream>
#include <cstdio>
#include <bcm2835.h>
#include <unistd.h>
#include <cstring>

using namespace std;

#define TEST_TIMES 10
#define TEST_DELAY 500000 // us 

#define COLOR1 0xFFEE00
#define COLOR2 0x11EE22

#define START_BYTE 0xFF
#define STOP_BYTE  0xFF
#define LED_ID 0x00
#define NUM_LED 88
#define DATA_OFFSET 4

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

	uint16_t dataLen = 6 + 3 * NUM_LED;
	char test_seq[dataLen + 1];

	// Setup SPI
	bcm2835_spi_setBitOrder(BCM2835_SPI_BIT_ORDER_MSBFIRST);      // The default
	bcm2835_spi_setDataMode(BCM2835_SPI_MODE0);                   // The default
	bcm2835_spi_setClockDivider(BCM2835_SPI_CLOCK_DIVIDER_256);   // div by 256 = 1MHz 
	bcm2835_spi_chipSelect(BCM2835_SPI_CS0);                      // The default
	bcm2835_spi_setChipSelectPolarity(BCM2835_SPI_CS0, LOW);      // the default

	printf("data LEN = %d\n", dataLen);
	for (int i = 0; i < TEST_TIMES; ++i)
	{
		printf("Send color 1..\n");
		genColorSeq(test_seq, dataLen, 0xFF, 0xFF, 0xFF); 
		bcm2835_spi_transfern(test_seq, dataLen);
		usleep(TEST_DELAY);
		
		printf("Send color 2...\n");
		genColorSeq(test_seq, dataLen, 0xFF, 0x00, 0x00);
		bcm2835_spi_transfern(test_seq, dataLen);
		usleep(TEST_DELAY);
		
		printf("Send color 3...\n");
		genColorSeq(test_seq, dataLen, 0x00, 0x00, 0xFF);
		bcm2835_spi_transfern(test_seq, dataLen);
		usleep(TEST_DELAY);

		printf("Send color 4...\n");
		genColorSeq(test_seq, dataLen, 0x00, 0xFF, 0xFF);
		bcm2835_spi_transfern(test_seq, dataLen);
		usleep(TEST_DELAY);
	}


	genColorSeq(test_seq, dataLen, 0x00, 0x00, 0x00); // turn off, color #000000
	bcm2835_spi_transfern(test_seq, dataLen);
	printf("done.\n");
	
	// Terminate
	bcm2835_spi_end();
	bcm2835_close();
}

void genColorSeq(char *seq, const uint16_t &len, const uint8_t r, const uint8_t g, const uint8_t b)
{
	seq[0] = START_BYTE;
	seq[1] = LED_ID;
	seq[2] = NUM_LED >> 8;
	seq[3] = NUM_LED;
	for (uint16_t i = 0 ; i < NUM_LED; ++i)
	{
		printf("[%3d] ", 3 * i + DATA_OFFSET);
		
		seq[3 * i + DATA_OFFSET] = r;
		seq[3 * i + DATA_OFFSET + 1] = g;
		seq[3 * i + DATA_OFFSET + 2] = b;

		printf("%.2X-%.2X-%.2X\n", seq[3 * i + DATA_OFFSET], seq[3 * i + DATA_OFFSET + 1] , seq[3 * i + DATA_OFFSET + 2]);
	}
	seq[len - 2] = 0xFF;
	seq[len - 1] = 0xFF;
	// printf("%d\n", strlen(seq));
}
