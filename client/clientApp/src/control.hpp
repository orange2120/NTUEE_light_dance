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

EL el1(16, 0x40), el2(8, 0x41);
LED_Strip leds(NUM_OF_LED, numLEDs);

void ReadJson(json& data)
{
    for(int i = 0; i < PEOPLE_NUM; ++i) { // dimension of people
        people.push_back(Person());
        for(size_t j = 0; j < data[i].size(); ++j) { // dimension of execution
            cerr << "[Reading] Person " << i << " executions " << j << "..." << endl;
            people[i].time_line.push_back(Execute());
            Execute& e = people[i].time_line[j];

            e.set_start_time(data[i][j]["Start"]);

            cerr << "[Reading] LEDs..." << endl;
            // set LED part
            for(int k = 0; k < NUM_OF_LED; ++k)
                e.set_LED_part(data[i][j]["Status"][LEDs[k]]["path"], data[i][j]["Status"][LEDs[k]]["alpha"]);
            
            // set EL part
            cerr << "[Reading] ELs..." << endl;
            double a[NUM_OF_EL];
            for(int k = 0; k < NUM_OF_EL; ++k)
                a[k] = data[i][j]["Status"][ELs[k]];
            e.set_EL_part(a);
        }
    }
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
    // send EL sig FIXME:
    for(int i = 0; i < NUM_OF_EL; ++i) {
        double br = e.EL_parts[i].get_brightness()*4096;
        if(i < 16) el1.setEL(i, uint16_t(br));
        else el2.setEL(i%16, uint16_t(br));
    }
    // send LED sig
    for(int i = 0; i < NUM_OF_LED; ++i) {
        leds.sendToStrip(i, e.LED_parts[i]->get_data());
    }
}

void turnOff()
{
    // send EL sig 
    for(int i = 0; i < NUM_OF_EL; ++i) {
        if(i < 16)  el1.setEL(i, 0);
        else el2.setEL(i%16, 0);
    }
    char* tmp = 0;
    // send LED sig 
    for(int i = 0; i < 1; ++i) {
        tmp = new char[numLEDs[i]];
        for(int j = 0; j < 3*numLEDs[i]; ++j) tmp[j] = 0;
        leds.sendToStrip(i, tmp);
    }
}

void run(int id) {
    double time = 0; // ms
    Person &p = people[id];
    p.t_index = 0;
    cerr << "start" << endl;
    sendSig(id);
    bool off = false;
    while(!off) 
    { 
        cout << "Time now: " << time << endl;
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
        if(double(duration.count()) < 30000) usleep(30000-double(duration.count())); // delay until 30ms
        else cerr << "sending time exceeds 30ms!!" << endl;
        time += 30;
    }
    p.t_index = 0;
    
}



// system call handler
void sigint_handler(int sig)
{
    printf("Catch SIGINT signal...\n");
    // TODO
    turnOff();
    // turn off ELs, LEDS, close file...
    printf("Exiting...\n");
    exit(1);
}

void sig_pause(int sig)
{
    printf("Pause!\n");
    // printf("Enter any to continue:\n");
    // cin.get();
}
