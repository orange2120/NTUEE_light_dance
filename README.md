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
├── accessories
├── asset
├── client
│   ├── Arduino
│   └── clientApp
│
├── data
├── editor
│   ├── css
│   ├── html
│   └── js
│
├── server
└── test
```
### accessories
For 道具

### asset
### client
Client program including RPi and Arduino  

### data
### editor
Dancing parameter online editor and simulator  

### test
For Testing Everything  

## References
- [2019 NTUEE light dance](https://github.com/andyh0913/NTUEE_light_dance)
- [Youtube video playlist](https://www.youtube.com/watch?v=5fHv55kS9Lo)