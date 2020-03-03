CXX = g++
CFLAGS = -g -Wall -std=c++11
.PHONY: all clean

TARGET = testApp ../clientApp/src/LED_strip.o
SRC_DIR = ../clientApp/src/
INC_DIR = ../clientApp/inc/
LIB_DIR = ../clientApp/lib/

EXEC = testApp
INC = -I$(INC_DIR)
SRC = $(wildcard $(SRC_DIR)*.cpp)
LIB = -L $(LIB_DIR) -lbcm2835 

all: $(TARGET)



testApp: testApp.cpp ../clientApp/src/LED_strip.o
	$(CXX) $(CFLAGS) $(INC) $(LDFLAGS) $^ -o $@

../clientApp/src/LED_strip.o:
	$(CXX) $(CFLAGS)  ../clientApp/src/LED_strip.cpp -c -o ../clientApp/src/LED_strip.o -g $(INC) $(LIB)
	
clean:
	rm -f $(TARGET)
	@echo "done."
