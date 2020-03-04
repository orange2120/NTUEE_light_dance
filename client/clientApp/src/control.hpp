#include <unistd.h>
#include "nlohmann/json.hpp"
#include "Data.h"
#include "definition.h"
#include "EL.h"
#include "LED_strip.h"
#include "time.h"
#include <unistd.h>
#include <chrono>
#include <string>

using namespace chrono;
using json = nlohmann::json;

extern vector<Person> people;
extern const uint16_t numLEDs[NUM_OF_LED];
extern const string ELs[NUM_OF_EL];
extern const string LEDs[NUM_OF_LED];
extern int dancer_id;

EL el1(16, 0x40), el2(8, 0x41);
LED_Strip leds(NUM_OF_LED, numLEDs);

void ReadJson(json& data)
{
    cerr << "[Reading] Json file";
    for(int i = 0; i < PEOPLE_NUM; ++i) { // dimension of people
        cerr << ".";
        if((i+1)%4 == 0) {
            for(int j = 0; j < 4; ++j)  cerr << '\b'; 
            for(int j = 0; j < 4; ++j)  cerr << " ";
            for(int j = 0; j < 4; ++j)  cerr << '\b';
        }
        people.push_back(Person());
        for(size_t j = 0; j < data[i].size(); ++j) { // dimension of execution
            people[i].time_line.push_back(Execute());
            Execute& e = people[i].time_line[j];

            e.set_start_time(data[i][j]["Start"]);

            // set LED part
            for(int k = 0; k < NUM_OF_LED; ++k)
                e.set_LED_part(data[i][j]["Status"][LEDs[k]]["name"], data[i][j]["Status"][LEDs[k]]["alpha"]);
            
            // set EL part
            double a[NUM_OF_EL];
            for(int k = 0; k < NUM_OF_EL; ++k)
                a[k] = data[i][j]["Status"][ELs[k]];
            e.set_EL_part(a);
        }
    }
    cerr << endl << "[Done!!]" << endl;
}

bool init(const string& path) {
    ifstream infile(path);
    if (!infile.is_open())
        return false;
    json data = json::parse(infile);
    ReadJson(data);
    return true;
}

void sendSig(int id) {
    Execute &e = people[id].time_line[people[id].t_index];
    // send EL sig 
    for(int i = 0; i < NUM_OF_EL; ++i) {
        double br = e.EL_parts[i].get_brightness()*4095;
        if(i < 16) el1.setEL(i, uint16_t(br));
        else el2.setEL(i%16, uint16_t(br));
    }
    // send LED sig
    for(int i = 0; i < NUM_OF_LED; ++i) {
        leds.sendToStrip(i, e.LED_parts[i]->get_data());
        if(i != NUM_OF_LED-1)   usleep(20000);
    }
}

void turnOff()
{
    // send EL sig 
    for(int i = 0; i < NUM_OF_EL; ++i) {
        if(i < 16)  el1.setEL(i, uint16_t(0));
        else el2.setEL(i%16, uint16_t(0));
    }
    char* tmp = 0;
    // send LED sig 
    for(int i = 0; i < 1; ++i) {
        tmp = new char[numLEDs[i]];
        for(int j = 0; j < 3*numLEDs[i]; ++j) tmp[j] = 0;
        leds.sendToStrip(i, tmp);
    }
    delete[] tmp;
}

void run(int id, int time) {
    // time (ms)
    Person &p = people[id];
    p.t_index = 0;
    if(time < 0) {
        cerr << "[ERROR] Input Time Should Bigger Than 0 !!" << endl;
        return;
    }
    if(time > p.time_line[p.time_line.size()-2].start_time) {
        cerr << "[ERROR] Input Time Exceed Total Time!!" << endl;
        return;
    }
    for(size_t i = 0; i < p.time_line.size(); ++i) {
        if(time < p.time_line[i].start_time) {
            p.t_index = i;
            continue;
        }
        else break;
    }

    cerr << "Dancer "<< id << " Starting From " << time << "..." << endl;
    sendSig(id);
    bool off = false;
    cerr << "Time now: ";
    while(!off) 
    {   
        cerr << time;
        auto start = high_resolution_clock::now();
        if(time >= p.time_line[p.t_index+1].start_time) { 
            if(p.t_index == p.time_line.size()-2) { // last one is a dummy execution
                p.t_index = 0;
                turnOff();
                off = true;
            }
            else {
                ++p.t_index;
                sendSig(id);
            }
        }
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end-start); // transmission time
        if(double(duration.count()) < PERIOD*1000) usleep(PERIOD*1000-double(duration.count())); // delay until 30000 us (30 ms)
        else {
            for(unsigned i = 0; i < to_string(time).length()+10; ++i) cerr << '\b';
            cerr << "[ERROR] Sending Time Exceeds " << PERIOD << "ms!!" << endl;
            return;
        }
        for(unsigned i = 0; i < to_string(time).length(); ++i) cerr << '\b';
        time += PERIOD;
    }
    p.t_index = 0;
    for(size_t i = 0; i < 10; ++i) cerr << '\b';
    cerr << "[End of Signal]" << endl;
}

// Parse the string "str" for the token "tok", beginning at position "pos",
// with delimiter "del". The leading "del" will be skipped.
// Return "string::npos" if not found. Return the past to the end of "tok"
// (i.e. "del" or string::npos) if found.

size_t myStrGetTok(const string& str, string& tok, size_t pos = 0,
            const char del = ' ')
{
   size_t begin = str.find_first_not_of(del, pos);
   if (begin == string::npos) { tok = ""; return begin; }
   size_t end = str.find_first_of(del, begin);
   tok = str.substr(begin, end - begin);
   return end;
}

// Convert string "str" to integer "num". Return false if str does not appear
// to be a number
bool myStr2Int(const string& str, int& num)
{
   num = 0;
   size_t i = 0;
   int sign = 1;
   if (str[0] == '-') { sign = -1; i = 1; }
   bool valid = false;
   for (; i < str.size(); ++i) {
      if (isdigit(str[i])) {
         num *= 10;
         num += int(str[i] - '0');
         valid = true;
      }
      else return false;
   }
   num *= sign;
   return valid;
}

// system call handler
void sigint_handler(int sig)
{
    printf("Catch SIGINT signal...\n");
    // TODO
    turnOff();
    // turn off ELs, LEDS, close file...
    printf("Exiting...\n");
    exit(0);
}

void sig_pause(int sig)
{
    cerr << endl;
    printf("Pause!\n");
    turnOff();
    return;
    // string cmd, tok;
    // size_t pos;
    // int time = 0; // begin time
    // bool end = false;
    // while(!end) {
    //     cmd = ""; tok = ""; time = 0; pos = 0;
    //     cin.clear();
    //     cout << ">> ";
    //     getline(cin, cmd); cmd.append(" ");
    //     pos = myStrGetTok(cmd, tok, pos);
    //     if(pos == string::npos) continue;
    //     else if(tok != "run") {
    //         cerr << "[ERROR] No existing command " << tok << endl;
    //         continue;
    //     }
    //     else {
    //         if(myStrGetTok(cmd, tok, pos) == string::npos) { // default begin time = 0
    //             time = 0;
    //         }
    //         else if (!myStr2Int(tok, time)) {
    //             cerr << "[ERROR] Format Error, "  << tok << " Is Not a Number!!"<< endl;
    //             continue;
    //         }
    //     }
    //     run(dancer_id, time);
    // }
}