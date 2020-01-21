#ifndef _DATA_H_
#define _DATA_H_

#include <vector>
#include <string>
#include <fstream>
#include <string>
#include <iostream>
#include <map>

#include "nlohmann/json.hpp"

using namespace std;

class Person;
class Execute;
class EL_part;
class LED_part;

enum Part_EL {
  head = 0,
  left_arm = 1, 
  right_arm = 2, 
  breast = 3, 
  left_leg = 4, 
  right_leg = 5
};

enum Part_LED {
  head = 0,
  left_arm = 1,
  right_arm = 2,
  breast = 3,
  left_leg = 4,
  right_leg = 5
};

class Person { // for every dancer
  public:
    Person():t_index(0) {}
    ~Person() {}
    void set_execute(const Execute&); // push execution one by one
    void print();
    int t_index; // place in time_line
    vector<Execute> time_line; // including every execution in time order
  private:
};

class Execute { // for every execution
    friend Person;
  public:
    // Member function
    void set_start_time(const double& d) { start_time = d; }
    void set_end_time(const double& d) { end_time = d; }
    void set_LED_part(const string&, const double& ); // set each LED_part one by one 
    void set_EL_part(int[7]); // set every EL_parts for one time
    void print() const;

    // Data member
    double start_time;
    double end_time;
    vector<LED_part> LED_parts;
    vector<EL_part>  EL_parts;
  private:
};

class EL_part { // for each part of EL
    friend class Execute;
    friend class Person;
  public:
    // Member function
    EL_part(const int& s){ 
      brightness = uint16_t(s); 
      part = Part_EL(el_count); 
      ++el_count; 
    }
    uint16_t get_brightness() const { return brightness; }

    // Data member
    static int el_count;
  private:
    Part_EL part;
    uint16_t brightness; // 0~4095
};

class LED_part { // for each part of LED
    friend class Execute;
    friend class Person;
  public:
    // Member function
    LED_part() { part = Part_LED(led_count); ++led_count; }
    ~LED_part() { delete RGB_data; }
    LED_part(const string&, const double&); 
    string get_path() const { return path; }
    double get_alpha() const { return alpha; }
    void print() const;

    // Data member
    static int led_count;

  private:
    Part_LED part;
    string path;  // LED array path
    unsigned dataSize;
    double alpha; // for brightness
    char* RGB_data;
};

#endif // _DATA_H_