/****************************************************************************
  FileName     [ definition.h ]
  PackageName  [ clientApp ]
  Synopsis     [ communication protocol definitions ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

//----------------------------------------------------------------------
//    Global static funcitons
//----------------------------------------------------------------------

//----------------------------------------------------------------------
//    SPI communication
//----------------------------------------------------------------------

#define SPI_CLOCK_DIV BCM2835_SPI_CLOCK_DIVIDER_256 // div by 256 = ~1MHz 
#define DATA_OFFSET   3     // real data after start bytes
#define START_BYTE    0xFF
#define STOP_BYTE     0xFF  // stop signal

//----------------------------------------------------------------------
//    Global functions
//----------------------------------------------------------------------

