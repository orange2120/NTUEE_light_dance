/****************************************************************************
  FileName     [ testImg.cpp ]
  PackageName  [ image_test ]
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
#include <time.h>
#include "nlohmann/json.hpp"
#include "definition.h"
#include "LED_strip.h"

using json = nlohmann::json;
using namespace std;

#define alpha 1
#define TEST_INTERVAL 500000 // us

const string Dir = "./energy_json/";
const string Ending = ".json";
int id = 0, dataSize = 0;
LED_Strip leds(NUM_OF_LED, numLEDs);


bool cmpEnding(const string& fullstr, const string& ending) { // compare ending of FileName
    if(fullstr.length() >= ending.length()) {
        return ( 0 == fullstr.compare(fullstr.length() - ending.length(), ending.length(), ending);
    }
    else return false;
}

void getFiles(const string&, vector<string>&);
void readFile(const vector<string>&, vector<char*>&);



int main(int argc, char *argv[])
{
    if(argc == 3) {
        Dir = argv[2];
    }
    else if (argc != 2)
	{
		cerr << "[ERROR] Invalid parameter\n";
		cerr << "Usage: sudo ./testImg <strip ID> [JSON file path]\n";
		return -1;
	}

    id = atoi(argv[1]);
    if(id == 0) dataSize = 300;
    else dataSize = 40;
    vector<string> FileNames;
    vector<char*>  RGBs;
    getFiles(Dir, FileNames);
    readFile(FileNames, RGBs);
    for(int i : RGBs.size()) {
        leds.sendToStrip(id, RGBs[i]);
        usleep(TEST_INTERVAL);
    }

    // turnoff
    char* tmp = 0;
    tmp = new char[dataSize];
    for(int j = 0; j < dataSize; ++j) tmp[j] = 0;
    leds.sendToStrip(id, tmp);
    delete[] tmp;
    usleep(TEST_INTERVAL);
    cout << "done!" << endl;
}

void getFiles(const string& dir_path, vector<string>& files) {
    DIR* dp;
    dirent* dirp;
    if((dp = opendir(dir_path.c_str())) == NULL) {
        cout << "can't open " << dir_path << "!!" << endl;
        return;
    }
    while ((dirp = readdir(dp)) != NULL ) {
        // cerr << dirp->d_name << endl;
        // FIXME: test dir/file
        if(cmpEnding(dirp->d_name, Ending)) {
            files.push_back(dirp->d_name);
        }
    }
    closedir(dp);
}

void readFile(const vector<string>& files, vector<char*>& RGB_datas) {
    for(int i : files.size()) {
        ifstream infile(files[i]);
        json RGB = json::parse(infile);
        char* data = new char[dataSize];
        for(int j : dataSize) {
            double tmp = RGB[i];
            tmp *= alpha;
            data[i] = char(int(tmp));
        }
        RGB_datas.push_back(data);
        delete[] data;
    }
}