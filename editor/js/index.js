import * as PIXI from 'pixi.js'
import '../css/slider.css'
import '../css/index.css'
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.js'
import Mytimeline from './timeline/mytimeline.js'
import MyWaveSurfer from './wavesurfer/wavesurfer.js';
import Manager from './manager/manager.js'
import Presets from './presets/presets.js'
// read data
const load = require('../../data/load.json');
// let control = require(`../../data/${load.Control}`);
let control = null;
if (window.localStorage.getItem('control') === null) {
    control = require(`../../data/${load.Control}`);
}
else {
    control = JSON.parse(window.localStorage.getItem('control'));
}

let presets_load = null;
if (window.localStorage.getItem('presets') === null) {
    presets_load = require(`../../data/presets/${load.Presets}`);
}
else {
    presets_load = JSON.parse(window.localStorage.getItem('presets'));
}


// // get LEDs
// const LEDs = load.LED
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

// presets
const presets = new Presets(mgr, presets_load);

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
