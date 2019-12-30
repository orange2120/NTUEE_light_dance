CXX = g++
CFLAGS = -Wall -std=c++11 $(INC)
OPTFLAGS = -g
# OPTFLAGS = -O3

EXEC = clientApp
INC = -Iinc/
SRC = src/
OBJS = definition.o EL.o LED_strip.o Data.o
LIB = -lbcm2835

TARGET = clientApp

.PHONY: all clean

all: $(TARGET)

clientApp: src/clientApp.cpp $(LIB) $(OBJS)
	$(CXX) $(CFLAGS) $(OPTFLAGS) $(LDFLAGS) $^ -o bin/$@

EL.o: $(INC)/EL.h
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

LED_strip.o: $(INC)/LED_strip.h $(SRC)/LED_strip.cpp
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

Data.o: $(SRC)/
	$(CXX) $(CFLAGS) &(OPTFLAGS) $< -o $(SRC)/$@

clean:
	rm -f $(TARGET)