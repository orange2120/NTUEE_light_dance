// require ('webpack-hot-middleware/client')
import * as GoldenLayout from 'golden-layout';
import * as PIXI from 'pixi.js';
// import Constant;
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from './constants';

import Simulator from './simulator/simulator.js';
import Editor from './editor/editor.js';
import Mytimeline from './timeline/mytimeline.js';
import MyWaveSurfer from './wavesurfer/wavesurfer.js';
import Manager from './manager/manager.js';
import Presets from './presets/presets.js';
import Commandcenter from './commandcenter/commandcenter.js';
import Layout_Config from './golden_layer/layout_config.js';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import '../css/goldenlayout-base.css';
import '../css/goldenlayout-dark-theme.css';
import '../css/slider.css';
import '../css/index.css';

function importAllAsset(r) {
    r.keys().forEach(r);
}
importAllAsset(require.context('../../asset', true, /\.(png|svg|jpg|gif)$/));
importAllAsset(require.context('../../music', true, /\.(ogg|mp3|wav|mpe?g)$/i));

const myLayout = new GoldenLayout( Layout_Config, $('.my-container') );

myLayout.registerComponent( 'timeline_Component', function( container, componentState ){
    container.getElement().html('<div id="audio"><div id="operators"> <button id="playPause-btn"><i class="fas fa-play"></i>Play/<i class="fas fa-pause"></i>Pause</button> <button id="stop-btn"><i class="fas fa-stop"></i>Stop</button> <input type="range" id="zoom-slider" /></div><div id="waveform"></div><div id="wave-timeline"></div></div>');
});

myLayout.registerComponent( 'command_Component', function( container, componentState ){
    container.getElement().html( '<div id="commandComponent_zone"></div>' );

});
myLayout.registerComponent( 'display_Component', function( container, componentState ){
    container.getElement().html('<div id="simulator"></div>');
});
myLayout.registerComponent( 'editor_Component', function( container, componentState ){
    container.getElement().html('<div id="editor"><div class="time-el"> <span class="time"> Time: <input class="time-input" type="number" /> </span> <button id="timeInd-left-btn" class="timeInd-switch-btn"> <i class="fas fa-chevron-left"></i> </button> <input class="timeInd-input" type="number" /> <button id="timeInd-right-btn" class="timeInd-switch-btn"> <i class="fas fa-chevron-right"></i> </button></div><div class="checkbox-list" id="dancer-checkbox-list"></div><div id="edit-btn-grp" class="edit-btn-grp"> <button id="editbtn" class="edit-btn editbtn">EDIT</button> <button id="addbtn" class="edit-btn addbtn">ADD</button> <button id="savebtn" class="edit-btn savebtn">SAVE</button></div><div class="slider-list" id="slider-list"></div> <button id="delbtn" class="edit-btn delbtn">DEL</button></div>');
});

myLayout.registerComponent( 'presets_Component', function( container, componentState ){
    container.getElement().html('<div id="presets"><div class="title"> <span>Presets:</span> <span class="presets-addbtn">+</span></div><div id="presets-list"></div></div>');
});

myLayout.init();


myLayout.on("initialised",() => {    
    myLayout.root.contentItems[ 0 ].on("itemDestroyed",(item)=>{
        console.log("itemDestroyed")
        if(item.origin.isComponent && item.origin.componentName === "command_Component"){
            cc.hide()
        }
    })
    // console.log(myLayout)
    document.onkeyup = function(e) {
        if (e.ctrlKey && e.altKey && (e.which == 67 || e.which == 99)) {// e.ctrlKey && e.altKey && e.which == 87
        //   alert("Ctrl + Alt + C shortcut combination was pressed");
          if (myLayout.root.getItemsById("id_command_Component").length == 0) {
            let newItemConfig = {
                type: 'component',
                width : 25.644599303135884,height : 20,
                title : 'Command',
                id : "id_command_Component",
                componentName: 'command_Component',
                componentState: { label: 'command_Component' }
            }
            console.log(myLayout.root.getItemsById("asd"))
            
            myLayout.root.contentItems[0].addChild(newItemConfig);
            cc.show()
          }
          else {
            myLayout.root.getItemsById("id_command_Component")[0].remove()
            cc.hide()
          }
        
        }
    };

    console.log("finish init")

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

    // get LEDs
    // const LEDs = load.LED

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
    const wavesurfer = new MyWaveSurfer(mgr, load.Music);
    
    // presets
    const presets = new Presets(mgr, presets_load);

    // timeline
    // const mytimeliner = new Mytimeline(mgr);
    // mytimeliner.createFromData(control,load);
    
    mgr.setSim(sim);
    mgr.setEditor(editor);
    mgr.setWaveSurfer(wavesurfer);
    // mgr.setTimerliner(mytimeliner);
    // mgr.exec(0);
    // timeliner

    // CommandCenter
    const cc = new Commandcenter(mgr)
    cc.init()

    // DOM stuff
    document.querySelector('body').style.overflow = 'auto';
})
