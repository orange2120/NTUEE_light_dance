#include "Data.h"
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "nlohmann/json.hpp"

using json = nlohmann::json;
string LED_NAME[1] = { "LEDH" };
char   EL_NAME[7]  = { 'A', 'B', 'C', 'D', 'E', 'F', 'G'};

void Person::print()
{
    for(size_t i = 0; i < time_line.size(); ++i) {
        cout << "execution " << i << endl << "{" << endl;
        time_line[i].print();
        cout << "}" << endl;
    }
}

void Person::set_execute(const Execute& e) { 
    time_line.push_back(e); 
}

void Execute::print() const
{
    cout << "\t" << "\"Start\": " << start_time << "," << endl;
    cout << "\t" << "\"End\": " << end_time << "," << endl;
    cout << "\t" << "\"Status\": {" << endl;
    for(size_t i = 0; i < LED_parts.size(); ++i) {
        cout << "\t\t\"" << LED_NAME[i] << "\": {" << endl;
        cout << "\t\t\t\"path\": \"" << LED_parts[i].get_path() << "\"," << endl;
        cout << "\t\t\t\"alpha\": \"" << LED_parts[i].get_alpha() << endl;
        cout << "\t\t}," << endl;
    }

    for(size_t i = 0; i < EL_parts.size(); ++i) {
        cout << "\t\t\"" << EL_NAME[i] << "\": " << EL_parts[i].get_brightness();
        if(i != EL_parts.size()-1) cout << ",";
        cout << endl;
    }
    cout << "\t}" << endl;
}

void Execute::set_LED_part(const string& s, const double& d) { LED_parts.push_back(LED_part(s, d)); }
void Execute::set_EL_part(int a[7]) { // set every EL_parts for one time
    for(int i = 0; i < 7; ++i) {
        EL_parts.push_back(EL_part(a[i]));
    }
}

LED_part::LED_part(const string& s, const double& d):path(s), alpha(d) {
    ifstream infile(s);
    json RGB = json::parse(infile);
    dataSize = RGB.size();
    RGB_data = new uint8_t[dataSize];

    for(size_t i = 0; i < dataSize; ++i) {
        RGB_data[i] = uint8_t(RGB[i]);
    }
}

void LED_part::print() const
{
    cout << "[";
    for(uint i = 0; i < dataSize; ++i) {
        cout << int(RGB_data[i]);
        if(i != dataSize-1) cout << ", ";
        else cout << "]" << endl;
    }
}