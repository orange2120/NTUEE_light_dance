#include <unistd.h>
#include "nlohmann/json.hpp"
#include "Data.h"
#include "definition.h"
#include "EL.h"
#include "LED_strip.h"
#include "time.h"
#include <unistd.h>
#include <chrono>

using namespace chrono;
using json = nlohmann::json;

extern vector<Person> people;
extern uint16_t numLEDs[NUM_OF_LED];

void ReadJson(json& data)
{
    
    for(int i = 0; i < PEOPLE_NUM; ++i) { // dimension of people
        people.push_back(Person());
        for(size_t j = 0; j < data[i].size(); ++j) { // dimension of execution
            people[i].time_line.push_back(Execute());
            Execute& e = people[i].time_line[j];

            e.set_start_time(data[i][j]["Start"]);

            // set LED part
            e.set_LED_part(data[i][j]["Status"]["LEDH"]["path"], data[i][j]["Status"]["LEDH"]["alpha"]);
            e.set_LED_part(data[i][j]["Status"]["LEDH"]["path"], data[i][j]["Status"]["LEDH"]["alpha"]);
            e.set_LED_part(data[i][j]["Status"]["LEDH"]["path"], data[i][j]["Status"]["LEDH"]["alpha"]);
            // set EL part
            double a[NUM_OF_EL] = {
                data[i][j]["Status"]["A"],
                data[i][j]["Status"]["B"],
                data[i][j]["Status"]["C"],
                data[i][j]["Status"]["D"],
                data[i][j]["Status"]["E"],
                data[i][j]["Status"]["F"]
            };
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
    EL el(NUM_OF_EL);
    LED_Strip leds(NUM_OF_LED, numLEDs);
    Execute &e = people[id].time_line[people[id].t_index];
    // send EL sig FIXME:
    for(int i = 0; i < NUM_OF_EL; ++i) {
        double br = e.EL_parts[i].get_brightness()*4096;
        el.setEL(i, uint16_t(br));
    }
    // send LED sig
    for(int i = 0; i < 1; ++i) {
        leds.sendToStrip(i, e.LED_parts[i]->get_data());
    }
}

void turnOff()
{
    EL el(NUM_OF_EL);
    
    LED_Strip leds(NUM_OF_LED, numLEDs);
    // Execute &e = people[id].time_line[people[id].t_index];
    // send EL sig FIXME:
    for(int i = 0; i < NUM_OF_EL; ++i) {
        el.setEL(i, 0);
    }
    char* tmp = 0;
    // send LED sig FIXME:
    for(int i = 0; i < 1; ++i) {
        tmp = new char[numLEDs[i]];
        for(int j = 0; j < 3*numLEDs[i]; ++j) tmp[j] = 0;
        leds.sendToStrip(i, tmp);
    }
}

void run(int id) {
    double time = 0; // ms
    Person &p = people[id];
    cout << "here" << endl;
    sendSig(id);
    bool off = false;
    while(!off) 
    { 
        cout << "Time now: " << time << endl;
        auto start = high_resolution_clock::now();
        if(time >= p.time_line[p.t_index+1].start_time) { 
            if(p.t_index == p.time_line.size()-2) { // last one is a dummy execution
                ++p.t_index;
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
