CXX = g++
CFLAGS = -g -Wall -std=c++11 -Wno-psabi
.PHONY: all clean

TARGET = testImg LED_strip.o

SRC_DIR = ../clientApp/src/
INC_DIR = ../clientApp/inc/

EXEC = testApp
LIB = -lbcm2835
INC = -I$(INC_DIR)

all: $(TARGET)

testImg: testImg.cpp LED_strip.o $(LIB)
	$(CXX) $(CFLAGS) $(LDFLAGS) $(INC) $^ -o $@

LED_strip.o: $(SRC_DIR)/LED_strip.cpp $(INC_DIR)/LED_strip.h
	$(CXX) $(CFLAGS) $(INC) $(LIB) -c $< -o $@

clean:
	rm -f $(TARGET)
	@echo "done."
