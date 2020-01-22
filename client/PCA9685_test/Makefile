CXX = g++
CFLAGS = -g -Wall -std=c++11
LIB = -lbcm2835 -lpca9685 
INC = -I./ -L./
.PHONY: all clean

TARGET = PCAtest

all: $(TARGET)

PCAtest: PCAtest.cpp $(LIB)
	$(CXX) $(CFLAGS) $(INC) $(LDFLAGS) $^ -o $@

clean:
	rm -f $(TARGET)