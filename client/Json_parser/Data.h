#include <vector>
#include <string>
#include <iostream>
#include <map>

using namespace std;

class Person;
class Execute;
class EL_part;
class LED_part;

class Person { // for every dancer
public:
    Person() {}
    ~Person();
    void set_execute(const Execute&); // push execution one by one
    void print();
private:
    vector<Execute> time_line; // including every execution in time order
};

class Execute { // for every execution
public:
    void set_start_time(const double& d) { start_time = d; }
    void set_end_time(const double& d) { end_time = d; }
    void set_LED_part(const string&, const double& ); // set each LED_part one by one 
    void set_EL_part(int[7]); // set every EL_parts for one time
    void print();
private:
    double start_time;
    double end_time;
    vector<LED_part> LED_parts;
    vector<EL_part>  EL_parts;
};

class EL_part { // for each part of EL
public:
    EL_part(const int& s){ brightness = uint16_t(s); }
    uint16_t get_brightness() { return brightness; }
private:
    uint16_t brightness;
};

class LED_part { // for each part of LED
public:
    LED_part(const string& s, const double& d):path(s), alpha(d) {} 
    string get_path() { return path; }
    double get_alpha(){ return alpha; }
private:
    string path;  // LED array path
    double alpha; // for brightness
};

