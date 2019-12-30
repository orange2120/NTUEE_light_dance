CFLAGS = -g -Wall -std=c++11

./build/parserRun: ./build/Data_parser.o ./build/Data.o
	g++ -o ./build/parserRun ./build/Data_parser.o ./build/Data.o $(CFLAGS)

./build/Data_parser.o: Data_parser.cpp Data.h
	g++ -c -o ./build/Data_parser.o Data_parser.cpp $(CFLAGS)

./build/Data.o: Data.cpp Data.h
	g++ -c -o ./build/Data.o Data.cpp $(CFLAGS)
	
clean:
	rm -rf ./build/*
	