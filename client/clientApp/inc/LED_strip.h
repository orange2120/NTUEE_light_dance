/****************************************************************************
  FileName     [ LED_strip.h ]
  PackageName  [ clientApp ]
  Synopsis     [ LED strip control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#ifndef _LED_STRIP_H_
#define _LED_STRIP_H_

#include <unistd.h>
#include <bcm2835.h>
#include <cstdio>

// #include "SPI_comm.h"

#define DATA_OFFSET   4     // real data after start bytes
#define START_BYTE    0xFF
#define STOP_BYTE     0xFF  // stop signal

#define SPI_CLOCK_DIV BCM2835_SPI_CLOCK_DIVIDER_256 // div by 256 = ~1MHz 

class LED_Strip
{
  public:
    LED_Strip();
    LED_Strip(const uint8_t &,const uint16_t *);
    ~LED_Strip();

    void sendToStrip(const uint8_t &, const char *);
    void getSeq(const uint8_t &, const uint16_t &, char *, const char *);
  
  private:
    uint8_t _nStrips = 0;
    uint8_t *_nLEDs;
    // SPI_comm spi;

};

#endif // _LED_STRIP_H_