import * as PIXI from 'pixi.js'
import React from 'react';
import ReactDOM from 'react-dom';
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.jsx'
import Manager from './manager/manager.js'
import '../css/index.css'
// read data
import load from '../../data/load.json'
import control from '../../data/control_test3.json'

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

// simulate display
const sim = new Simulator(app, control, load.Texture)

// manager set property
const mgr = new Manager();
mgr.setControl(control);
mgr.setSim(sim);
mgr.exec(0);

// editor
ReactDOM.render(<Editor mgr={mgr} />, document.querySelector("#editor"));