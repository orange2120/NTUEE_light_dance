CXX = g++
CFLAGS = -g -Wall -std=c++11
LIB = -lbcm2835
.PHONY: all clean

TARGET = test

all: $(TARGET)

test: test.cpp $(LIB)
	$(CXX) $(CFLAGS) $(LDFLAGS) $^ -o $@

clean:
	rm -f $(TARGET)
