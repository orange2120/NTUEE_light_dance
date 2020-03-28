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
extern const double convertEL[11];

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
    uint16_t br[NUM_OF_EL];
    for(int i = 0; i < NUM_OF_EL; ++i) {
        if(a[i] == 0)        br[i] = convertEL[0];
        else if(a[i] == 0.1) br[i] = convertEL[1];
        else if(a[i] == 0.2) br[i] = convertEL[2];
        else if(a[i] == 0.3) br[i] = convertEL[3];
        else if(a[i] == 0.4) br[i] = convertEL[4];
        else if(a[i] == 0.5) br[i] = convertEL[5];
        else if(a[i] == 0.6) br[i] = convertEL[6];
        else if(a[i] == 0.7) br[i] = convertEL[7];
        else if(a[i] == 0.8) br[i] = convertEL[8];
        else if(a[i] == 0.9) br[i] = convertEL[9];
        else if(a[i] == 1)   br[i] = convertEL[10];
        EL_parts.push_back(EL_part(br[i]));
    }
}

LED_part::LED_part(const string& s, const double& d):alpha(d) {
    idx = led_count;
    ++led_count;

    if(s == "") {
        dataSize = 0;
        RGB_data = 0;
        return;
    }
    path = DIR; path.append(s); path.append(".json");
    ifstream infile(path);
    if(!infile.is_open()){
        cerr << "[Error] Can't open file \"" << path << "\"." << endl;
        dataSize = 0;
        RGB_data = 0;
        return;
    }

    json RGB = json::parse(infile);
    dataSize = RGB.size();

    RGB_data = new char[dataSize];
    for(size_t i = 0; i < dataSize; ++i) {
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
