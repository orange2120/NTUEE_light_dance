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
    person p1;
    for(size_t i = 0; i < j["1"]["time_line"].size(); ++i) {
        execute exe;
        exe.set_start_time(j["1"]["time_line"][i]["Start"]);
        exe.set_end_time(j["1"]["time_line"][i]["End"]);
        exe.set_path(j["1"]["time_line"][i]["LEDA"]);
        int a[7] = { j["1"]["time_line"][i]['A'],
                     j["1"]["time_line"][i]['B'],
                     j["1"]["time_line"][i]['C'],
                     j["1"]["time_line"][i]['D'],
                     j["1"]["time_line"][i]['E'],
                     j["1"]["time_line"][i]['F'],
                     j["1"]["time_line"][i]['G'] };
        exe.set_part(a);
    }
    cout << j["1"]["time_line"][0] << endl;
    // using key to access object's member
    // using index to access array's member
}