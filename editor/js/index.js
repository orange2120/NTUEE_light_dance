require ('webpack-hot-middleware/client')
import * as GoldenLayout from 'golden-layout'
import * as PIXI from 'pixi.js'
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants'

import Simulator from './simulator/simulator.js'
import Editor from './editor/editor.js'
import Mytimeline from './timeline/mytimeline.js'
import MyWaveSurfer from './wavesurfer/wavesurfer.js';
import Manager from './manager/manager.js'
import Commandcenter from './commandcenter/commandcenter.js'
import '../css/slider.css'
import '../css/index.css'
import '../css/goldenlayout-base.css'
import '../css/goldenlayout-dark-theme.css'

let  layout_config = {
    content: [
    {
        type: 'row',
        content:[
            {
            type: 'column',
            content:[
                {
                    type: 'component',
                    height : 20,
                    componentName: 'timeline_Component',
                    title : 'Timeline',
                    componentState: { label: 'timeline_Component' }
                },
                {
                    type: 'row',
                    content:[
                        {
                            type: 'component',
                            componentName: 'display_Component',
                            title : 'Simulator',
                            componentState: { label: 'display_Component' }
                        },
                        {
                            type: 'component',
                            width : 24.978317432784035,
                            componentName: 'editor_Component',
                            title : 'editor',
                            componentState: { label: 'editor_Component' }
                        }
                    ]
                }
            ]
        },
        
        {
            type: 'component',
            width : 25.644599303135884,
            title : 'Command',
            componentName: 'command_Component',
            componentState: { label: 'command_Component' }
        }
        ]
    }
]
};

const myLayout = new GoldenLayout( layout_config );

myLayout.registerComponent( 'timeline_Component', function( container, componentState ){
    container.getElement().html( '<div id="timeline_zone"></div><div id="audio"><div id="operators"><button id="playPause-btn">Play/Pause</button><button id="stop-btn">Stop</button><input type="range" id="zoom-slider" /></div><div id="waveform"></div><div id="wave-timeline"></div></div>');
});

myLayout.registerComponent( 'command_Component', function( container, componentState ){
    container.getElement().html( '<div id="conrtol_zone"><div id="status_zone"></div><table id="board_table"><thead><tr><th class="handle">ID</th><th class="handle">IP</th><th class="handle">MAC</th><th class="handle">Status</th><th class="handle">Select</th></tr></thead><tbody id="board_table_body"><tr><td>id</td><td>ip1</td><td>mac1</td><td></td></tr><tr><td>id</td><td>ip2</td><td>mac2</td><td></td></tr><tr><td>id</td><td>ip3</td><td>mac3</td><td></td></tr></tbody></table> <button id="btn_test">test</button></div>' );
});
myLayout.registerComponent( 'display_Component', function( container, componentState ){
    container.getElement().html( '<div id="simulator"></div>' );
});
myLayout.registerComponent( 'editor_Component', function( container, componentState ){
    container.getElement().html( '<div id="editor"><div class="time-el"><span class="time"> Time: <input class="time-input" type="number" /> </span> <button id="timeInd-left-btn" class="timeInd-switch-btn"> <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i> </button> <input class="timeInd-input" type="number" /> <button id="timeInd-right-btn" class="timeInd-switch-btn"> <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i> </button></div><div class="checkbox-list" id="dancer-checkbox-list"></div><hr><div id="edit-btn-grp" class="edit-btn-grp"> <button id="editbtn" class="edit-btn editbtn btn btn-outline-primary">EDIT</button> <button id="addbtn" class="edit-btn addbtn">ADD</button> <button id="savebtn" class="edit-btn savebtn">SAVE</button></div><div class="slider-list" id="slider-list"></div> <button id="delbtn" class="edit-btn delbtn">DEL</button> <br /> Upload File: <input type="file" id="upload-file" /> <button id="downloadbtn" class="download-btn"> <a id="download-link"> Donwload File </a> </button></div>' );
});

myLayout.init();
myLayout.on("initialised",()=>{
    document.getElementById("btn_test").onclick= function(){
        console.log(myLayout.toConfig())
    }
    console.log("finish init")

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
    
    // CommandCenter
    const cc = new Commandcenter(mgr)
    
    
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
    
})



