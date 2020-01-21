#include <iostream>
#include <cstdio>
#include "Data.h"
#include <fstream>
#include <vector>
#include "definition.h"
#include "EL.h"
#include "LED_strip.h"

using namespace std;

vector<Person> people; // dancers

int main(int argc, char *argv[]) // arg = person id
{
    init();

    int dancer_id = atoi(argv[0]);
    string cmd;
    bool end = false;
    while(!end) {
        cin >> cmd;
        if(cmd == "run") run(dancer_id);
    }
    
}



