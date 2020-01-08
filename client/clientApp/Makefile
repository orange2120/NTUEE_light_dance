CXX = g++
CFLAGS = -Wall -std=c++11
OPTFLAGS = -g
# OPTFLAGS = -O3

EXEC = clientApp
BIN = bin/
INC = -Iinc/
SRC = src/
OBJS = EL.o LED_strip.o Data.o
LIB = -lbcm2835

TARGET = clientApp

.PHONY: all clean

all: $(TARGET)

clientApp: src/clientApp.cpp $(LIB) $(OBJS)
	$(CXX) $(CFLAGS) $(OPTFLAGS) $(LDFLAGS) $^ -o bin/$@

%.o : %.cpp
	@$(ECHO) "> compiling: $<"
	@$(CXX) $(CFLAGS) -I$(EXTINCDIR) -c -o $@ $<

EL.o: $(INC)/EL.h
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

LED_strip.o: $(INC)/LED_strip.h $(SRC)/LED_strip.cpp
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

Data.o: $(SRC)/
	$(CXX) $(CFLAGS) &(OPTFLAGS) $< -o $(SRC)/$@

clean:
	rm -f $(TARGET)