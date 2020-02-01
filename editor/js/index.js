import * as PIXI from 'pixi.js'
import React from 'react';
import ReactDOM from 'react-dom';
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.jsx'
import '../css/index.css'
// read data
import load from '../../data/load.json'
import control from '../../data/control_test2.json'

// timeline
import Mytimeline from '../js/timeline/mytimeline.js'

function cb(_type,param){

}

let mytimeline = new Mytimeline(cb)
mytimeline.createFromData(control,load,cb);
// // get LEDs
// const LEDs = load.LED
// add waveform
const music = load.Music

// add simulate page
const app = new PIXI.Application({
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    backgroundColor: 0x555555,
})
document.getElementById('simulator').appendChild(app.view)

// Testing 
const testSprite = new PIXI.Sprite();

// simulate
const sim = new Simulator(app, control, load.Texture)
sim.exec(0)

// editor
ReactDOM.render(<Editor />, document.querySelector("#editor"));
