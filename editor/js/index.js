import * as PIXI from 'pixi.js'
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.js'
import Mytimeline from './timeline/mytimeline.js'
import MyWaveSurfer from './wavesurfer/wavesurfer.js';
import Manager from './manager/manager.js'
import '../css/slider.css'
import '../css/index.css'
// read data
const load = require('../../data/load.json');
let control = require(`../../data/${load.Control}`);
// let control = null;
// if (window.localStorage.getItem('control') === null) {
    // control = require(`../../data/${load.Control}`);
// }
// else {
    // control = JSON.parse(window.localStorage.getItem('control'));
// }


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

// wavesurfer
const wavesurfer = new MyWaveSurfer(mgr, `../../music/${music}`);

// timeliner
// const mytimeliner = new Mytimeline(mgr);
// mytimeliner.createFromData(control,load);

mgr.setSim(sim);
mgr.setEditor(editor);
mgr.setWaveSurfer(wavesurfer);
// mgr.setTimerliner(mytimeliner);
// mgr.exec(0);

// editor
// ReactDOM.render(<Editor mgr={mgr} timeInd={mgr.timeInd} />, document.querySelector("#editor"));
