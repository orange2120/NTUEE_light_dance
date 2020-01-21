#include "Data.h"

using json = nlohmann::json;

int EL_part::el_count = 0;
int LED_part::led_count = 0;

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
        cout << "\t\t\"" << Part_EL(i) << "\": {" << endl;
        cout << "\t\t\t\"path\": \"" << LED_parts[i].path << "\"," << endl;
        cout << "\t\t\t\"alpha\": \"" << LED_parts[i].alpha << endl;
        cout << "\t\t}," << endl;
    }

    for(size_t i = 0; i < EL_parts.size(); ++i) {
        cout << "\t\t\"" << Part_LED(i) << "\": " << EL_parts[i].get_brightness();
        if(i != EL_parts.size()-1) cout << ",";
        cout << endl;
    }
    cout << "\t}" << endl;
}

void Execute::set_LED_part(const string& s, const double& d) { 
    LED_part led(s, d);
    LED_parts.push_back(led); 
}
void Execute::set_EL_part(int a[7]) { // set every EL_parts for one time
    for(int i = 0; i < 7; ++i) {
        EL_parts.push_back(EL_part(a[i]));
    }
}

LED_part::LED_part(const string& s, const double& d):path(s), alpha(d) {
    ifstream infile(s);
    json RGB = json::parse(infile);
    dataSize = RGB.size();
    RGB_data = new char[dataSize];

    for(uint8_t i = 0; i < dataSize; ++i) {
        int tmp = RGB[i];
        RGB_data[i] = char(tmp);
    }
}

void LED_part::print() const {
    for(uint8_t i = 0; i < dataSize; ++i) {
        cout << RGB_data[i];
    }
    cout << endl;
}
