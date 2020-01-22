#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <signal.h>
#include <unistd.h>

#include "bcm2835.h"
#include "pca9685.h"
using namespace std;

PCA9685 *pca = NULL;

void sigint_handler(int);

int main()
{
    if (getuid() != 0) {
		fprintf(stderr, "Program is not started as \'root\' (sudo)\n");
		return -1;
	}

    if (bcm2835_init() != 1) {
		fprintf(stderr, "bcm2835_init() failed\n");
		return -2;
	}

    struct sigaction handler_int;
    handler_int.sa_handler = sigint_handler;
    sigfillset(&handler_int.sa_mask);
    sigaction(SIGINT, &handler_int, 0);

    PCA9685 pca9685;
	pca9685.Dump();
    pca9685.SetFrequency(1000);

    pca = &pca9685;

    cout << "Usage:\n>> <ID> <Duty cycle>" << endl;

    while (1)
    {
        string cmd = "";
        string tmp = "";
        vector<string> tok;

        cout << ">> ";
        getline(cin, cmd, '\n');
        // cout << cmd << endl;
        istringstream in(cmd);

        while(in >> tmp)
            tok.push_back(tmp);
        
        size_t nTok = tok.size();
        if (nTok != 2)
        {
            cerr << "Invalid parameter\n";
            continue;
        }

        uint8_t id = (uint8_t)stoul(tok[0]);
        uint16_t duty = (uint16_t)stoul(tok[1]);

        cout << "ID = " << (unsigned)id << " Duty = " << duty << endl;

        pca9685.Write(CHANNEL(id), VALUE(duty));
    }
}

void sigint_handler(int sig)
{
    printf("\nCatch SIGINT signal...\n");
    
    for (uint8_t i = 0; i < 16; ++i)
	    pca->SetFullOff(CHANNEL(i), true);

    printf("Exiting...\n");
    exit(1);
}