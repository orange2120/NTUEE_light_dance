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
#include <string>
#include <signal.h>
#include <setjmp.h>
#include "time.h"

#include "control.hpp"
#include "definition.h"

using namespace std;
using json = nlohmann::json;

extern const string DIR;
extern const string FILENAME;
vector<Person> people; // dancers
int dancer_id = 0;
jmp_buf jmpbuffer;
long sysStartTime = 0;

int main(int argc, char *argv[]) // arg[1] = person id
{
    struct sigaction handler_int, handler_usr1;
    // struct sigaction handler_int;
    handler_int.sa_handler = sigint_handler;
    handler_usr1.sa_handler = sig_pause;
    // signal(SIGUSR1, sig_pause);

    if (argc == 2) {
        dancer_id = atoi(argv[1]);
    }
    else if (argc > 2)
    {
        fprintf(stderr, "[ERROR] Invalid parameters!\nUsage: sudo ./clientApp [dancer ID] \n");
        return -1;
    }

    if (getuid() != 0) {
		fprintf(stderr, "[ERROR] Program is not started as \'root\' (sudo)\n");
		return -1;
	}

    if (sigfillset(&handler_int.sa_mask) < 0 || sigfillset(&handler_usr1.sa_mask) < 0)
    // if (sigfillset(&handler_int.sa_mask) < 0)
    {
        fprintf(stderr, "[ERROR] Fillset error!\n");
        return -1;
    }
    handler_int.sa_flags = 0;
    handler_usr1.sa_flags = 0;

    // if (sigaction(SIGINT, &handler_int, 0) < 0)
    if (sigaction(SIGINT, &handler_int, 0) < 0 || sigaction(SIGUSR1, &handler_usr1, 0) < 0 )
    {
        fprintf(stderr, "[ERROR] sigaction failed!\n");
        return -1;
    }

    string path = DIR;
    path.append(FILENAME);

    if (!init(path))
    {
        cerr << "[ERROR] Init failed!\n";
        return -1;
    }
    
    printf("Dancer ID = %d\n", dancer_id);

    turnOff();
    // people[0].print();

    string cmd, tok;
    size_t pos;
    int time = 0; // begin time
    bool end = false;
    unsigned start_frame = 0;
    setjmp(jmpbuffer);
    // if(setjmp(jmpbuffer) == 1)  signal(SIGUSR1, sig_pause);
    cout << "Usage:\"run [start time]\"" << endl;
    while(!end) {
        cmd = ""; tok = ""; time = 0; pos = 0;
        cin.clear();
        cout << ">> ";
        getline(cin, cmd); cmd.append(" ");
        pos = myStrGetTok(cmd, tok, pos);
        if(pos == string::npos) continue;
        else if(tok == "print") {
            people[dancer_id].print();
            continue;
        }
        else if(tok == "jump") {
            if(myStrGetTok(cmd, tok, pos) == string::npos) { // default begin time = 0
                time = 0;
            }
            else if (!myStr2Int(tok, time)) {
                cerr << "[ERROR] Format Error, "  << tok << " Is Not a Number!!"<< endl;
                continue;
            }
            start_frame = jumpIndex(dancer_id,time);
            
        }
        else if(tok == "run") {
            if(myStrGetTok(cmd, tok, pos) == string::npos) { // default begin time = 0
                time = 0;
            }
            else if (!myStr2Int(tok, time)) {
                cerr << "[ERROR] Format Error, "  << tok << " Is Not a Number!!"<< endl;
                continue;
            }
            sysStartTime = getsystime();
            run(dancer_id, time,start_frame);
        }
        else {
            cerr << "[ERROR] Invalid command! \"" << tok << "\"" << endl;
            continue;
        }
        
    }

    printf("Exiting...\n");
    
    return 0;
}
