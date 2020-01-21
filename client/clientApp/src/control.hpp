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

extern vector<Person> people;


void ReadJson(json& data)
{
    for(int i = 0; i < PEOPLE_NUM; ++i) { // dimension of people
        Person p;
        for(size_t j = 0; j < data[i].size(); ++j) { // dimension of execution
            Execute e;
            e.set_start_time(data[i][j]["Start"]);
            e.set_end_time(data[i][j]["End"]);

            // set LED part
            e.set_LED_part(data[i][j]["Status"]["LEDH"]["path"], data[i][j]["Status"]["LEDH"]["alpha"]);

            // set EL part
            int a[6] = {
                data[i][j]["Status"]["A"],
                data[i][j]["Status"]["B"],
                data[i][j]["Status"]["C"],
                data[i][j]["Status"]["D"],
                data[i][j]["Status"]["E"],
                data[i][j]["Status"]["F"],
            };
            e.set_EL_part(a);

            p.set_execute(e);
        }
        people.push_back(p);
    }
}

void init() {
    ifstream infile("./json/test1.json");
    json data = json::parse(infile);
    ReadJson(data);
    people.reserve(PEOPLE_NUM);
}

void sendSig(int id) {
    EL el(NUM_OF_EL);
    uint16_t nLEDs[NUM_OF_LED] = { LEDS_0, LEDS_1, LEDS_2
                                   LEDS_3, LEDS_4, LEDS_5 }
    LED_Strip leds(NUM_OF_LED, nLEDs[NUM_OF_LED]);
    Execution &e = people[id].time_line[people[id].t_index];
    // send EL sig
    for(int i = 0; i < NUM_OF_EL; ++i) {
        for(int j = 0; j < e.EL_parts.size(); ++j) {
            el.setEL(j, e.EL_parts[j].get_brightness());
        }
    }

    // send LED sig
    for(int i = 0; i < NUM_OF_LED; ++i) {
        leds.sendToStrip(i, e.LED_parts[i].RGB_data);
    }
}

void run(int id) {
    double time = 0; // ms
    Person &p = people[id]; 
    while(true) 
    {
        auto start = high_resolution_clock::now();
        if(time >= p.time_line[p.t_index].end_time) {
            ++p.t_index;
            sendSig(id);
        }
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(stop-start); // transmission time
        if(doulbe(duration.count()) < 30000) usleep(30000-doulbe(duration.count()); // delay until 30ms
        else cerr << "sending time exceeds 30ms!!" << endl;
        time += 30;
    }
    */
}

// system call handler
void sigint_handler(int sig)
{
    printf("Catch SIGINT signal...\n");
    // TODO
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
