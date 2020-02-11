/****************************************************************************
  FileName     [ clientApp.cpp ]
  PackageName  [ clientApp ]
  Synopsis     [ main function ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/

#include <iostream>
#include <cstdio>
#include <fstream>
#include <vector>
#include <signal.h>

#include "control.hpp"
#include "definition.h"

using namespace std;
using json = nlohmann::json;

uint16_t numLEDs[NUM_OF_LED] = { LEDS_0, LEDS_1, LEDS_2,
                                 LEDS_3, LEDS_4, LEDS_5 };

vector<Person> people; // dancers

int main(int argc, char *argv[]) // arg[1] = person id, arg[2] = json_path
{
    struct sigaction handler_int, handler_usr1;
    handler_int.sa_handler = sigint_handler;
    handler_usr1.sa_handler = sig_pause;

    string path = "./json/test1.json";

    if (argc == 3) path = argv[2];
    else if (argc != 2)
    {
        fprintf(stderr, "[ERROR] Invalid parameters!\nUsage: ./clientApp <dancer ID> <Input file path>\n");
        return -1;
    }

    if (getuid() != 0) {
		fprintf(stderr, "Program is not started as \'root\' (sudo)\n");
		return -1;
	}

    if (sigfillset(&handler_int.sa_mask) < 0 || sigfillset(&handler_usr1.sa_mask) < 0)
    {
        fprintf(stderr, "Fillset error!\n");
        return -1;
    }
    handler_int.sa_flags = 0;
    handler_usr1.sa_flags = 0;

    if (sigaction(SIGINT, &handler_int, 0) < 0 || sigaction(SIGUSR1, &handler_usr1, 0) < 0 )
    {
        fprintf(stderr, "[ERROR] sigaction failed!\n");
        return -1;
    }

    int dancer_id = atoi(argv[1]);
    string cmd;
    bool end = false;
    
    if (!init(path))
    {
        cerr << "[ERROR] Init failed\n";
        return -1;
    }

    printf("Dancer ID = %d\n", dancer_id);

    while(!end) {
        cin.clear();
        cin >> cmd;
        cout << ">> "  << cmd << endl;
        if(cmd == "run") 
        {
            printf("Start!\n");
            run(dancer_id);
            break;
        }
    }
    printf("Done!\n");
    
    return 0;
}
