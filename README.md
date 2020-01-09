# 2020 NTUEE Light dance
Light dance system for 2020 NTUEE night

## Features
- Programs for hardward control
- Light dance control center
- Sheet light online editor
- Sheet light simulator

## System architecture

### Server
Control dancers via a Wi-Fi router. 

### Client
Each dancer is a client device. Receive commands from the server.

## Orange Hsu is not god

### Editor
usage for develop:

``` npm run editor:dev ```

## Directory structure
```
NTUEE_light_dance
├── asset
│   ├── Arduino
│   └── clientApp
│
├── client
├── data
├── editor
├── server
└── test
```

### asset
### client
Client program including RPi and Arduino 

### data
### editor
Dancing parameter online editor and simulator

### test
Testing program and files

## References
- [2019 NTUEE light dance](https://github.com/andyh0913/NTUEE_light_dance)
- [Youtube video](https://www.youtube.com/watch?v=5fHv55kS9Lo)