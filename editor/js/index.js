import * as PIXI from 'pixi.js'
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import '../css/index.css'
// read data
import load from '../../data/load.json'
import control from '../../data/control_test.json'

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
