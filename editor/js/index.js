import * as PIXI from 'pixi.js'
import React from 'react';
import ReactDOM from 'react-dom';
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.js'
import Mytimeline from '../js/timeline/mytimeline.js'
import Manager from './manager/manager.js'
import '../css/slider.css'
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
    backgroundColor: 0x38393d,
})
document.getElementById('simulator').appendChild(app.view)

// manager
const mgr = new Manager();
mgr.setControl(control);

// simulate display
const sim = new Simulator(mgr, app, control, load.Texture)

// editor
const editor = new Editor(mgr);

// timeliner
const mytimeliner = new Mytimeline(mgr);
mytimeliner.createFromData(control,load);

mgr.setSim(sim);
mgr.setEditor(editor);
mgr.setTimerliner(mytimeliner);
// mgr.exec(0);

// editor
// ReactDOM.render(<Editor mgr={mgr} timeInd={mgr.timeInd} />, document.querySelector("#editor"));
