#include <iostream>
#include "Data.h"
#include "json.hpp"
#include <fstream>
#include "definition.h"
#include "EL.h"
#include "LED_strip.h"

using namespace std;



int main(int argc, char *argv[]) // arg == person id
{
    Person people; // dancer
    init();

    int dancer_id = atoi(argv[0]);
    string cmd;
    bool end = false;
    while(!end) {
        cin >> cmd;
        if(cmd == "run") run(dancer_id);
    }
    
    printf("Hello World!\n");
}



