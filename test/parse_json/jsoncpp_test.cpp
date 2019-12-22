#include "json.hpp"
#include "data.h"
#include <fstream>
#include <iostream>
#include <string>
#include <sstream>

using namespace std;
using json = nlohmann::json;

int main()
{
    ifstream infile("DATA_v0.json");
    json j = json::parse(infile);
    person p1(1);
    for(size_t i = 0; i < j["1"]["time_line"].size(); ++i) {
        execute exe;
        exe.set_start_time(j["1"]["time_line"][i]["Start"]);
        exe.set_end_time(j["1"]["time_line"][i]["End"]);
        exe.set_LED_part( j["1"]["time_line"][i]["Status"]["LEDH"]["path"], 
                          j["1"]["time_line"][i]["Status"]["LEDH"]["alpha"] );
        int a[7] = { j["1"]["time_line"][i]["Status"]['A'],
                     j["1"]["time_line"][i]["Status"]['B'],
                     j["1"]["time_line"][i]["Status"]['C'],
                     j["1"]["time_line"][i]["Status"]['D'],
                     j["1"]["time_line"][i]["Status"]['E'],
                     j["1"]["time_line"][i]["Status"]['F'],
                     j["1"]["time_line"][i]["Status"]['G'] };
        exe.set_EL_part(a);
        p1.set_execute(exe);
    }
    // using key to access object's member
    // using index to access array's member
}