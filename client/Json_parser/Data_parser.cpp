#include "json.hpp"
#include "Data.h"
#include <fstream>
#include <iostream>
#include <string>

#define PEOPLE_NUM 3

using namespace std;
using json = nlohmann::json;

void ReadJson(json&, vector<Person>&);

int main()
{
    ifstream infile("./test_json/test1.json");
    json data = json::parse(infile);
    vector<Person>  people;
    ReadJson(data, people);
    people[0].print();
}

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