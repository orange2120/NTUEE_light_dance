/****************************************************************************
  FileName     [ LED_strip.h ]
  PackageName  [ clientApp ]
  Synopsis     [ LED strip control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#ifndef _LED_STRIP_H_
#define _LED_STRIP_H_

#include <bcm2835.h>
#include <unistd.h>

class LED_Strip
{
  public:
    LED_Strip();
    ~LED_Strip();
    void sendSeq(const uint8_t &, const char *)


  private:
    uint8_t _nStrips = 0;
    uint8_t *_nLEDs;

};

#endif // _LED_STRIP_H_