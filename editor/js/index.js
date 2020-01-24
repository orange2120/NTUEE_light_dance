import * as PIXI from 'pixi.js'
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import '../css/index.css'
// read data
import load from '../../data/load.json'
import control from '../../data/control_test.json'

import  Mytimeline from './timeline/mytimeline.js'

// timeline
let data_blank={
    "version": "1.2.0",
    "modified": "Mon Dec 08 2014 10:41:11 GMT+0800 (SGT)",
    "title": "Light_Dance",
    "layers": [
        {
            "name": "dancer_1",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        },
        {
            "name": "dancer_2",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        },
        {
            "name": "dancer_3",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        },
        {
            "name": "pos_1",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        },
        {
            "name": "pos_2",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        },
        {
            "name": "pos_3",
            "values": [],
            "tmpValue": 3.500023,
            "_color": "#6ee167",
            "_value": 0.9955620977777778
        }
    ],
    "ui": {
        "currentTime": 1.6,
        "totalTime": 20,
        "scrollTime": 0,
        "timeScale": 60
    }
};

const tl = new Mytimeline(data_blank)

// get LEDs
const LEDs = load.LED
// add waveform
const music = load.Music

// add simulate page
const app = new PIXI.Application({
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    backgroundColor: 0x555555,
})
document.body.appendChild(app.view)

// simulate
const sim = new Simulator(app, control, LEDs)
sim.exec(0)
