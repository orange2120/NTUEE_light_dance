/****************************************************************************
  FileName     [ Data.h ]
  PackageName  [ clientApp ]
  Synopsis     [ data read, execute ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#ifndef _DATA_H_
#define _DATA_H_

#include <vector>
#include <string>
#include <fstream>
#include <string>
#include <iostream>
#include <map>
#include <definition.h>

#include "nlohmann/json.hpp"

using namespace std;

class Person;
class Execute;
class EL_part;
class LED_part;

enum Part_EL {
  head_el = 0,
  left_arm_el = 1, 
  right_arm_el = 2, 
  breast_el = 3, 
  left_leg_el = 4, 
  right_leg_el = 5
};

enum Part_LED {
  head_led = 0,
  left_arm_led = 1,
  right_arm_led = 2,
  breast_led = 3,
  left_leg_led = 4,
  right_leg_led = 5
};

class Person { // for every dancer
  public:
    Person():t_index(0) {}
    ~Person() {}
    inline void set_execute(Execute); // push execution one by one
    void print() const;
    int t_index = 0 ; // place in time_line
    vector<Execute> time_line; // including every execution in time order
  private:
};

class Execute { // for every execution
    friend Person;
  public:
    // Member function
    Execute() {}
    ~Execute() {}
    void set_start_time(const double& d) { start_time = d; }
    void set_end_time(const double& d) { end_time = d; }
    void set_LED_part(const string&, const double& ); // set each LED_part one by one 
    void set_EL_part(double[NUM_OF_EL]); // set every EL_parts for one time
    void print() const;

    // Data member
    double start_time;
    vector<LED_part*> LED_parts;
    vector<EL_part>  EL_parts;
  private:
};

class EL_part { // for each part of EL
    friend class Execute;
    friend class Person;
  public:
    // Member function
    EL_part(const int& s){ 
      brightness = double(s); 
      part = Part_EL(el_count); 
      ++el_count; 
    }
    double get_brightness() const { return brightness; }

    // Data member
    static int el_count;
  private:
    Part_EL part;
    double brightness; // 0~1
};

class LED_part { // for each part of LED
    friend class Execute;
    friend class Person;
  public:
    // Member function
    LED_part() { part = Part_LED(led_count); ++led_count; }
    LED_part(const string&, const double&); 
    ~LED_part() {
      if(RGB_data != 0) {
        delete[] RGB_data;
        RGB_data = 0;
      }
    }
    string get_path() const { return path; }
    double get_alpha() const { return alpha; }
    char* get_data() const { return RGB_data; }
    void print() const;

    // Data member
    static int led_count;

  private:
    Part_LED part;
    string path;  // LED array path
    unsigned dataSize;
    double alpha; // for brightness
    char* RGB_data = NULL;
};

#endif // _DATA_H_