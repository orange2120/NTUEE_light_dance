CXX = g++
CFLAGS = -Wall -std=c++11
OPTFLAGS = -g
# OPTFLAGS = -O3

SRC_DIR = src/
INC_DIR = inc/
BIN_DIR = bin/
LIB_DIR = lib/

EXEC = clientApp
BIN	= $(addprefix $(BIN_DIR), $(EXEC))
INC = -I$(INC_DIR)
SRC = $(wildcard $(SRC_DIR)*.cpp)
OBJ = $(SRC:%.cpp=%.o)
LIB = -lbcm2835 -lpca9685 -L./$(LIB_DIR)
LIBDEP = $(LIB_DIR)libpca9685.a
# LDFLAGS += -L$(LIB_DIR)

TARGET = clientApp

.PHONY: all clean

all: $(BIN)

$(BIN): $(OBJ)
	$(CXX) $(CFLAGS) $(OPTFLAGS) $(LDFLAGS) $(OBJ) $^ -o $(BIN)

%.o : %.cpp
	@echo "> compiling: $<"
	$(CXX) $(CFLAGS) $(INC) $(LIB) $(LIBDEP) -c $< -o $@

clean:
	rm -f $(TARGET) $(OBJ)