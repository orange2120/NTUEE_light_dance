# 2020 NTUEE Light dance

Light dance system for 2020 NTUEE night

## Table of contents

- [2020 NTUEE Light dance](#2020-ntuee-light-dance)
  - [Table of contents](#table-of-contents)
  - [Features](#features)
  - [System architecture](#system-architecture)
    - [Server](#server)
      - [setup (only for first time)](#setup-only-for-first-time)
      - [afterward usage](#afterward-usage)
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
- Online sheet light editor
- Sheet light simulator

## System architecture

### Server
<<<<<<< HEAD

Control dancers via a Wi-Fi router.

#### setup (only for first time)

1. if boards_config.json exists, delete it.
2. build server

=======
Control dancers via a Wi-Fi router. 
#### setup (only for first time)
1. if boards_config.json exists, delete it.
2. build server
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
```bash
$ npm i
$ npm run build
```
<<<<<<< HEAD

the program will automatically generate new `boards_config.json`

3. on RPi, (make sure we use new generated `boards_config.json`)

=======
the program will automatically generate new `boards_config.json`
3. on RPi, (make sure we use new generated `boards_config.json`)
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
```bash
$ cd client/clientApp
$ sudo node client.js
```
<<<<<<< HEAD

4. on ESP8266, just open it
5. on your laptop(server), go to http://localhost:8080
=======
4. on ESP8266, just open it
5. on your laptop(server), go to http://localhost:8080 
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
6. toogle control+alt/option+c to show the CommandCenter panel
7. make sure edit board configuration is enabled
8. at the right side of the panel is the boards not registered
9. there you should see your rpi, click add board
10. after adjusting boards' id pattern , remember to click Save
11. disable edit board configuration
12. you can now send command to your boards!!

#### afterward usage
<<<<<<< HEAD

1.

=======
1. 
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
```bash
$ npm start
```

<<<<<<< HEAD
2. on your laptop(server), go to http://localhost:8080
3. the rest is the same(RPi, ESP8266)
=======
2. on your laptop(server), go to http://localhost:8080  
3. the rest is the same(RPi, ESP8266)  

>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0

### Client

Each dancer is a client device. Receive commands from the server.

### Editor
<<<<<<< HEAD

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
=======
> usage for develop front-end:
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0

```bash
npm run editor:dev
```

5. run

```bash
npm start
# editor will run at localhost:8080
```

> adding new LED pictures

1. ADD the picture to asset/LED/LED_CHEST or LED_L_SHOE or LED_R_SHOE
2. Go data/load.json, add new LED name to valid "Texture":

```json
"Texture": {
  "LED_CHEST": ["bl_chest", "chest1", "chest2"],
  "LED_R_SHOE": ["bl_shoe", "r_shoe1", "r_shoe2"],
  "LED_L_SHOE": ["bl_shoe", "l_shoe1", "l_shoe2"]
}
// for example
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

> adding new LED pictures

1. ADD the picture to asset/LED/LED_CHEST or LED_L_SHOE or LED_R_SHOE
2. Go data/load.json, add new LED name to valid "Texture":
```json
"Texture": {
  "LED_CHEST": ["bl_chest", "chest1", "chest2"],
  "LED_R_SHOE": ["bl_shoe", "r_shoe1", "r_shoe2"],
  "LED_L_SHOE": ["bl_shoe", "l_shoe1", "l_shoe2"]
}
// for example
```

## Directory structure

```
NTUEE_light_dance
├── accessories
├── asset
│   ├── BlackPart
│   ├── LED
│   └── Part
│
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
├── music
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
