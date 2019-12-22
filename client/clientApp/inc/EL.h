/****************************************************************************
  FileName     [ EL.h ]
  PackageName  [ clientApp ]
  Synopsis     [ Electroluminescent Wire control ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#ifndef _EL_H_
#define _EL_H_

#include "pca9685.h"

class EL
{
  public:
    EL(const uint8_t &nEL) : _nEL(nEL) {};
    ~EL(){};

    void setEL(const uint8_t &id, const uint16_t &dt) {
        _dutyCycle = dt;
        pca.Write(CHANNEL(id), VALUE(dt));
    };

    uint16_t getDutyCycle(const uint8_t &id) const { 
      uint16_t pOn, Off;
      pca.Read(CHANNEL(id), pOn, pOff);
      
      return (pOff - pOn) / 4096;
    };

    // turn off all the ELs
    void offAll() const {
        for (uint8_t i = 0; i < _nEL; ++i)
            pca.Write(CHANNEL(i), VALUE(0));
    };

    // turn on all the ELs
    void onAll() const { 
        for (uint8_t i = 0; i < _nEL; ++i)
            pca.Write(CHANNEL(i), VALUE(4095));
    };

  private:
    uint8_t _nEL; // number of ELs
    PCA9685 pca;
};

#endif // _EL_H_