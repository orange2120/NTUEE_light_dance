CFLAGS = -g -Wall -std=c++11

parserRun: Data_parser.o Data.o
	g++ -o Data_parser.o Data.o $(CFLAGS)

Data_parser.o: Data_parser.cpp Data.h
	g++ -c Data_parser.cpp $(CFLAGS)

Data.o: Data.cpp Data.h
	g++ -c Data.cpp $(CFLAGS)

