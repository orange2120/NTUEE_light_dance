/****************************************************************************
  FileName     [ definition.h ]
  PackageName  [ clientApp ]
  Synopsis     [ definitions ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

//----------------------------------------------------------------------
//    Global
//----------------------------------------------------------------------
#ifndef _DEF_H_
#define _DEF_H_
#include <string>

#define NUM_OF_EL  24 // number of EL strips
#define NUM_OF_LED 3 // number of LED strips
#define PEOPLE_NUM 8 // number of dancer

// Number of LEDs in strip
#define LEDS_0 300
#define LEDS_1 40
#define LEDS_2 40

const std::string ELs[NUM_OF_EL] = {
  "HAT1", "HAT2", "FACE1", "FACE2", 
  "R_COAT1", "R_COAT2", "L_COAT1", "L_COAT2",
  "INNER1", "INNER2", "R_ARM1", "R_ARM2", 
  "R_HAND", "L_ARM1", "L_ARM2", "L_HAND", 
  "R_PANTS1", "R_PANTS2", "L_PANTS1", "L_PANTS2", 
  "R_SHOE1", "R_SHOE2", "L_SHOE1", "L_SHOE2"
};

const std::string LEDs[NUM_OF_LED] = {
  "CHEST", "R_SHOE", "L_SHOE"
};

const uint16_t numLEDs[NUM_OF_LED] = { LEDS_0, LEDS_1, LEDS_2 };


#endif // _DEF_H_