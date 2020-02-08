import * as PIXI from 'pixi.js'
import React from 'react';
import ReactDOM from 'react-dom';
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.js'
import Manager from './manager/manager.js'
import '../css/slider.css'
import '../css/index.css'
// read data
import load from '../../data/load.json'
import control from '../../data/control_test2.json'

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

// manager
const mgr = new Manager();

// simulate display
const sim = new Simulator(app, control, load.Texture)

// editor
const editor = new Editor(mgr, control);

mgr.setControl(control);
mgr.setSim(sim);
mgr.setEditor(editor);
mgr.exec(0);

// editor
// ReactDOM.render(<Editor mgr={mgr} timeInd={mgr.timeInd} />, document.querySelector("#editor"));