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
// let data_from_load = load["timeline_setting"]
// console.log(data_from_load)

// console.log(control)
// let newa = control.map(timeline => { 
//     return{ name : "dancer_",tmpValue : 3.500023, _color: "#6ee167",
//     _value: 0.9955620977777778 ,values : timeline.map( entry => {
//         return {time : entry.Start, value: 0, _color : "#1b3e5c"};
//     })
// }; 
// })
// for (let i = 0; i < newa.length; i++) { 
//     newa[i].name = 'dancer_' + String(i);
// }
// data_from_load.layers = newa
// console.log(newa)
// console.log(data_from_load)
// control.map(timeline => ({ value: person.id, text: person.name }));
// let tmp = data_blank
// let data_used = Object.assign({},data_blank);
function cb(_type,time){

    console.log("callback! " + String(time) )
    console.log(tl.target)
}
const tl = new Mytimeline()
tl.createFromData(control,load,cb)


function conv(){
    
}

document.getElementById("aa").onclick = function test(){
    tl.KeyFrame(1,2)
}

document.getElementById("btn_reload").onclick = function test1(){

    console.log("reload!!")
    console.log(data_blank)
    tl.reload(data_blank)
    // delete tl
}

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
