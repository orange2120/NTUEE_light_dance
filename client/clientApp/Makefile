CXX = g++
CFLAGS = -Wall -std=c++11
OPTFLAGS = -g
# OPTFLAGS = -O3

SRC_DIR = src/
INC_DIR = inc/

# EXEC = clientApp
BIN = bin/
INC = -I$(INC_DIR)
SRC = $(wildcard $(SRC_DIR)*.cpp)
OBJ = $(SRC:%.cpp=%.o) #$(patsubst %.c, %.o, $(SRC))
LIB = -lbcm2835

TARGET = clientApp

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJ)
	echo $(SRC)
	$(CXX) $(CFLAGS) $(OPTFLAGS) $(LDFLAGS) $^ -o $(BIN)/$@

%.o : %.cpp
	@$(ECHO) "> compiling: $<"
	$(CXX) $(CFLAGS) $(INC) $(LIB) -c $< -o $@


# EL.o: $(INC)/EL.h
# 	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

# LED_strip.o: $(INC)/LED_strip.h $(SRC)/LED_strip.cpp
# 	$(CXX) $(CFLAGS) $(OPTFLAGS) $< -o $(SRC)/$@

# Data.o: $(SRC)/
# 	$(CXX) $(CFLAGS) &(OPTFLAGS) $< -o $(SRC)/$@

clean:
	rm -f $(TARGET) $(OBJ)