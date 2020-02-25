/****************************************************************************
  FileName     [ Data.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ data read, execute ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include "Data.h"
#include "definition.h"
#include <string>

using json = nlohmann::json;

extern const string ELs[NUM_OF_EL];
extern const string LEDs[NUM_OF_LED];
extern const string DIR;

int EL_part::el_count = 0;
int LED_part::led_count = 0;

void Person::print() const
{
    for(size_t i = 0; i < time_line.size(); ++i) {
        cout << "execution " << i << endl << "{" << endl;
        time_line[i].print();
        cout << "}" << endl;
    }
}

inline void Person::set_execute(Execute e) { 
    time_line.push_back(e);
}

void Execute::print() const
{

    cout << "\t" << "\"Start\": " << start_time << ",\n"
         << "\t" << "\"Status\": {" << endl;
    for(size_t i = 0; i < NUM_OF_LED; ++i) {
        cout << "\t\t\"" << LEDs[i] << "\": {\n"
             << "\t\t\t\"path\": \"" << LED_parts[i]->path << "\",\n"
             << "\t\t\t\"alpha\": \"" << LED_parts[i]->alpha << "\n"
             << "\t\t},\n";
    }

    for(size_t i = 0; i < NUM_OF_EL; ++i) {
        cout << "\t\t\"" << ELs[i] << "\": " << EL_parts[i].get_brightness();
        if(i != EL_parts.size()-1) cout << ",";
        cout << "\n";
    }
    cout << "\t}" << endl;
}

void Execute::set_LED_part(const string& s, const double& d) {
    LED_part* tmp = new LED_part(s, d);
    LED_parts.push_back(tmp);
}
void Execute::set_EL_part(double a[NUM_OF_EL]) { // set every EL_parts for one time
    for(int i = 0; i < NUM_OF_EL; ++i) {
        EL_parts.push_back(EL_part(a[i]));
    }
}

LED_part::LED_part(const string& s, const double& d):alpha(d) {
    idx = led_count;
    ++led_count;
    path = DIR; path.append(s); path.append(".json");
    ifstream infile(path);
    //cerr << "[Reading] led rgb...  " << path << endl;
    if(!infile.is_open()){
        cerr << "[Error] Can't open file \"" << path << "\"." << endl;
        dataSize = 0;
        RGB_data = 0;
        return;
    }

    json RGB = json::parse(infile);
    dataSize = RGB.size();

    RGB_data = new char[dataSize];
    for(int i = 0; i < dataSize; ++i) {
        double tmp = RGB[i];
        tmp *= d;
        RGB_data[i] = char(int(tmp));
    }
}

void LED_part::print() const {
    for(uint8_t i = 0; i < dataSize; ++i) {
        cout << RGB_data[i];
    }
    cout << endl;
}
