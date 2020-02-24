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
#include <string>

#include "control.hpp"
#include "definition.h"

using namespace std;
using json = nlohmann::json;

extern const string DIR;
extern const string FILENAME;
vector<Person> people; // dancers
int dancer_id = 0;

int main(int argc, char *argv[]) // arg[1] = person id
{
    struct sigaction handler_int, handler_usr1;
    handler_int.sa_handler = sigint_handler;
    handler_usr1.sa_handler = sig_pause;

    if (argc == 2) {
        dancer_id = atoi(argv[1]);
    }
    else if (argc > 2)
    {
        fprintf(stderr, "[ERROR] Invalid parameters!\nUsage: ./clientApp [dancer ID] \n");
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

    string path = DIR;
    path.append(FILENAME);

    if (!init(path))
    {
        cerr << "[ERROR] Init failed\n";
        return -1;
    }
    
    printf("Dancer ID = %d\n", dancer_id);


    // people[0].print();

    string cmd, tok;
    size_t pos;
    int time = 0; // begin time
    bool end = false;
    cout << "Usage:" << endl << ">> run [time]" << endl;
    while(!end) {
        cin.clear();
        cout << ">> ";
        getline(cin, cmd);
        pos = myStrGetTok(cmd, tok, pos);
        if(pos == string::npos) continue;
        else if(tok != "run") {
            cerr << "[ERROR] No existing command " << tok << endl;
            continue;
        }
        else {
            if(myStrGetTok(cmd, tok, pos) == string::npos) { // default begin time = 0
                time = 0;
            }
            else if (!myStr2Int(tok, time)) {
                cerr << "[ERROR] Format Error, "  << tok << " Is Not a Number!!"<< endl;
                continue;
            }
        }

        run(dancer_id, time);

    }

    printf("Exiting...\n");
    
    return 0;
}
