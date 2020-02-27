# 2020 NTUEE Light dance
Light dance system for 2020 NTUEE night

## Table of contents
- [2020 NTUEE Light dance](#2020-ntuee-light-dance)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [System architecture](#system-architecture)
    - [Server](#server)
    - [Client](#client)
    - [Editor](#editor)
  - [Directory structure](#directory-structure)
    - [accessories](#accessories)
    - [asset](#asset)
    - [client](#client-1)
    - [data](#data)
    - [editor](#editor-1)
    - [hardware](#hardware)
    - [server](#server-1)
    - [test](#test)
  - [References](#references)

## Features
- Programs for hardward control
- Light dance control center
- Online sheet light  editor
- Sheet light simulator

## System architecture

### Server
Control dancers via a Wi-Fi router. 

### Client
Each dancer is a client device. Receive commands from the server.

### Editor
> usage for develop front-end:

```bash
$ npm run editor:dev 
```

> usage for editor

1. install node

2. install packages
```bash
$ npm install
```

3. install webpack globally
```bash
npm install webpack -g
```

4. build
```bash
npm run editor:dev
```

5. run
```bash
npm start
# editor will run at localhost:8080
```


## Directory structure

```
NTUEE_light_dance
├── accessories
├── asset
├── client
│   ├── Arduino
│   ├── clientApp
│   └── clientSocket
│
├── data
├── editor
│   ├── css
│   ├── html
│   └── js
│
├── hardware
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
Online dancing parameter editor and simulator  

### hardware
Hardware design  
Controllers, circuits etc.  

### server
Server program for dancers control  

### test
For Testing Everything  

Orange Hsu is not god

## References
- [2019 NTUEE light dance](https://github.com/andyh0913/NTUEE_light_dance)
- [Youtube playlist of light dance](https://www.youtube.com/watch?v=5fHv55kS9Lo)