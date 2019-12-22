CXX = g++
CFLAGS = -Wall -std=c++11
OPTFLAGS = -g
# OPTFLAGS = -O3

INC = inc/
SRC = src/
LIB = -lbcm2835
.PHONY: all clean

all: $(TARGET)

clientApp: src/clientApp.cpp $(LIB)
	$(CXX) $(CFLAGS) $(OPTFLAGS) $(LDFLAGS) $^ -o $@

EL.o: $(INC)/EL.h
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

LED_strip.o: $(INC)/LED_strip.h $(SRC)/LED_strip.cpp
	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

clean:
	rm -f $(TARGET)