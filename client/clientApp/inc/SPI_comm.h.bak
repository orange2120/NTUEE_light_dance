/****************************************************************************
  FileName     [ SPI_comm.h ]
  PackageName  [ clientApp ]
  Synopsis     [ SPI communication protocol routines ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <cstdio>
#include <bcm2835.h>
#include <unistd.h>

#define SPI_CLOCK_DIV BCM2835_SPI_CLOCK_DIVIDER_256 // div by 256 = ~1MHz 

class SPI_comm
{
  public:
    SPI_comm() {};
    ~SPI_comm();
    void send(uint16_t &, const char *);

  private:

};