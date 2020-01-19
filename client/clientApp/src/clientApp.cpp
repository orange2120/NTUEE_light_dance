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
#include <signal.h>

#include "control.hpp"
#include "definition.h"

using namespace std;

int main(int argc, char *argv[]) // arg == person id
{
    struct sigaction handler_int, handler_usr1;
    handler_int.sa_handler = sigint_handler;
    handler_usr1.sa_handler = sig_pause;

    Person people; // dancer

    if (argc != 2)
    {
        perror("[ERROR] Invalid parameters!\nUsage: ./clientApp <dancer ID>\n");
        return -1;
    }

    if (sigfillset(&handler_int.sa_mask) < 0 || sigfillset(&handler_usr1.sa_mask) < 0)
    {
        perror("Fillset error!\n");
        return -1;
    }
    handler_int.sa_flags = 0;
    handler_usr1.sa_flags = 0;

    if (sigaction(SIGINT, &handler_int, 0) < 0 || sigaction(SIGUSR1, &handler_usr1, 0) < 0 )
    {
        perror("[ERROR] sigaction failed!\n");
        return -1;
    }

    init();

    int dancer_id = atoi(argv[0]);
    string cmd;
    bool end = false;

    printf("Dancer ID = %d\n", dancer_id);

    while(!end) {
        cin.clear();
        cin >> cmd;
        cout << ">> "  << cmd << endl;
        if(cmd == "run") 
        {
            printf("Start!\n");
            // run(dancer_id);
        }
        // printf("test\n");
    }
    return 0;
}
