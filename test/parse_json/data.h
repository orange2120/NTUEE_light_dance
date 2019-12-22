#include <vector>
#include <string>

using namespace std;

class person;
class execute;
class part;

enum LED_STATUS{
    OFF = 0,
    ON = 1,
    FADE_IN = 2,
    FADE_OUT = 3,
    FLASH = 4
};

class person {
public:
    
private:
    vector<execute> time_line;
};

class execute {
public:
    void set_start_time(const double& d) { start_time = d; }
    void set_end_time(const double& d) { end_time = d; }
    void set_path(const string& s) { LED_path = s; }
    void set_part(const int* a) {
        char n[7] = {'A', 'B', 'C', 'D', 'E', 'F', 'G'};
        for(int i = 0; i < 7; ++i) {
            parts.push_back(part(n[i], a[i]));
        }
    }
private:
    double start_time;
    double end_time;
    string LED_path;
    vector<part> parts;
};

class part {
public:
    part(char n, const int s):name(n) { 
        switch(s) {
            case 0:
                status = OFF;
                break;
            case 1:
                status = ON;
                break;
            case 2:
                status = FADE_IN;
                break;
            case 3:
                status = FADE_OUT;
                break;
            case 4:
                status = FLASH;
                break;
            default:
                status = OFF;
        }
    } // turn string into LED_STATUS
private:
    char name;
    LED_STATUS status;
};