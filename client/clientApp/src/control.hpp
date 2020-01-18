#include <unistd.h>
#include "nlohmann/json.hpp"
#include "Data.h"
#include "definition.h"
#include "EL.h"
#include "LED_strip.h"
#include "time.h"

using json = nlohmann::json;

void ReadJson(json& data, vector<Person>& people)
{
    for(int i = 0; i < PEOPLE_NUM; ++i) {
        Person p;
        for(size_t j = 0; j < data[i].size(); ++j) {
            Execute e;
            e.set_start_time(data[i][j]["Start"]);
            e.set_end_time(data[i][j]["End"]);

            // set LED part
            e.set_LED_part(data[i][j]["Status"]["LEDH"]["path"], data[i][j]["Status"]["LEDH"]["alpha"]);

            // set EL part
            int a[7] = {
                data[i][j]["Status"]["A"],
                data[i][j]["Status"]["B"],
                data[i][j]["Status"]["C"],
                data[i][j]["Status"]["D"],
                data[i][j]["Status"]["E"],
                data[i][j]["Status"]["F"],
                data[i][j]["Status"]["G"],
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
    // ReadJson(data, people);
}

void sendSig(int id) {
    EL el(NUM_OF_EL);
    // LED_Strip leds();
    
}

void run(int id) {
    /*
    long time = 0;
    Person &p = people[id]; // FIXME:
    while(true) 
    {
        if(time >= p.time_line[p.t_index].end_time) {
            ++p.t_index;
            sendSig(1);
        }
        usleep(30000); // us
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
    printf("exiting...\n");
    exit(1);
}
