/****************************************************************************
  FileName     [ testImg.cpp ]
  PackageName  [ Image_test ]
  Synopsis     [ main function ]
  Author       [  ]
  Copyright    [ Copyleft(c) , NTUEE, Taiwan ]
****************************************************************************/
#include <iostream>
#include <cstdio>
#include <fstream>
#include <vector>
#include <string>
#include <unistd.h>
#include "nlohmann/json.hpp"
#include "definition.h"
#include "LED_strip.h"

#define alpha 0.6
#define TEST_INTERVAL 500000 // us 

using json = nlohmann::json;
using namespace std;

int id = 0, dataSize = 0;
char* RGB_data = NULL;
string path = "";
LED_Strip leds(NUM_OF_LED, numLEDs);

int main(int argc, char *argv[])
{
    if (argc != 3)
	{
		cerr << "[ERROR] Invalid parameter\n";
		cerr << "Usage: sudo ./testImg <strip ID> <JSON file path>\n";
		return -1;
	}

    id = atoi(argv[1]);
    path = argv[2];
    ifstream infile(path);
    json RGB = json::parse(infile);
    dataSize = RGB.size();
    RGB_data = new char[dataSize];
    for(int i = 0; i < dataSize; ++i) {
        double tmp = RGB[i];
        tmp *= alpha;
        RGB_data[i] = char(int(tmp));
    }
    leds.sendToStrip(id, RGB_data);
}
