require("webpack-hot-middleware/client");
import * as GoldenLayout from "golden-layout";
import * as PIXI from "pixi.js";
// import Constant
import { DISPLAY_WIDTH, DISPLAY_HEIGHT } from "./constants";

import Simulator from "./simulator/simulator.js";
import Editor from "./editor/editor.js";
import Mytimeline from "./timeline/mytimeline.js";
import MyWaveSurfer from "./wavesurfer/wavesurfer.js";
import Manager from "./manager/manager.js";
import Commandcenter from "./commandcenter/commandcenter.js";
import "../css/slider.css";
import "../css/index.css";
import "../css/goldenlayout-base.css";
import "../css/goldenlayout-dark-theme.css";

let layout_config = {
  content: [
    {
      type: "column",
      isClosable: false,
      content: [
        {
          type: "column",
          content: [
            {
              type: "component",
              height: 20,
              isClosable: false,
              componentName: "timeline_Component",
              title: "Timeline",
              componentState: { label: "timeline_Component" },
            },
            {
              type: "row",
              content: [
                {
                  type: "component",
                  componentName: "display_Component",
                  title: "Simulator",
                  isClosable: false,
                  componentState: { label: "display_Component" },
                },
                {
                  type: "component",
                  width: 24.978317432784035,
                  componentName: "editor_Component",
                  title: "editor",
                  isClosable: false,
                  componentState: { label: "editor_Component" },
                },
              ],
            },
          ],
        },

        {
          type: "component",
          id: "id_command_Component",
          width: 25.644599303135884,
          height: 20,
          title: "Command",
          componentName: "command_Component",
          componentState: { label: "command_Component" },
        },
      ],
    },
  ],
};

const myLayout = new GoldenLayout(layout_config);

myLayout.registerComponent("timeline_Component", function (
  container,
  componentState
) {
  container
    .getElement()
    .html(
      '<div id="timeline_zone"></div><div id="audio"><div id="operators"><button id="playPause-btn">Play/Pause</button><button id="stop-btn">Stop</button><input type="range" id="zoom-slider" /></div><div id="waveform"></div><div id="wave-timeline"></div></div>'
    );
});

myLayout.registerComponent("command_Component", function (
  container,
  componentState
) {
  container.getElement().html('<div id="commandComponent_zone"></div>');
});
myLayout.registerComponent("display_Component", function (
  container,
  componentState
) {
  container.getElement().html('<div id="simulator"></div>');
});
myLayout.registerComponent("editor_Component", function (
  container,
  componentState
) {
  container
    .getElement()
    .html(
      '<div id="editor"><div class="time-el"><span class="time"> Time: <input class="time-input" type="number" /> </span> <button id="timeInd-left-btn" class="timeInd-switch-btn"> <i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i> </button> <input class="timeInd-input" type="number" /> <button id="timeInd-right-btn" class="timeInd-switch-btn"> <i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i> </button></div><div class="checkbox-list" id="dancer-checkbox-list"></div><hr><div id="edit-btn-grp" class="edit-btn-grp"> <button id="editbtn" class="edit-btn editbtn btn btn-outline-primary">EDIT</button> <button id="addbtn" class="edit-btn addbtn">ADD</button> <button id="savebtn" class="edit-btn savebtn">SAVE</button></div><div class="slider-list" id="slider-list"></div> <button id="delbtn" class="edit-btn delbtn">DEL</button> <br /> Upload File: <input type="file" id="upload-file" /> <button id="downloadbtn" class="download-btn"> <a id="download-link"> Donwload File </a> </button></div>'
    );
});

myLayout.init();

// manager
const mgr = new Manager();

// CommandCenter
const cc = new Commandcenter(mgr);

// myLayout.on( 'tabCreated', function( tab ){
//     console.log("tabCreated")
//     console.log(tab)
//     // if(tab.contentItem.componentName === "command_Component"){
//     //     tab.contentItem
//     //     cc.test()
//     // }
//     tab
// 		.closeElement
// 		.off( 'click' ) //unbind the current click handler
// 		.click(function(){
// 			//add your own

//             tab.contentItem.remove();

// 		});
// })

// myLayout.on( 'itemCreated', function( item ){
//     console.log("itemCreated")
//     console.log(item)
//     // if(tab.contentItem.componentName === "command_Component"){
//     //     tab.contentItem
//     //     cc.test()
//     // }
// })

// myLayout.on( 'componentCreated', function( c ){

//     console.log("componentCreated")
//     console.log(c)
//     if(c.componentName === "command_Component"){
//         // cc.test()
//     }
// })

myLayout.on("initialised", () => {
  cc.init();

  // myLayout.root.contentItems[ 0 ].on("componentCreated",()=>{
  //     console.log("componentCreated")
  //     cc.renderPannel()
  // })
  myLayout.root.contentItems[0].on("itemDestroyed", (item) => {
    console.log("itemDestroyed");
    if (
      item.origin.isComponent &&
      item.origin.componentName === "command_Component"
    ) {
      cc.hide();
    }
  });
  // console.log(myLayout)
  document.onkeyup = function (e) {
    if (e.ctrlKey && e.altKey && (e.which == 67 || e.which == 99)) {
      // e.ctrlKey && e.altKey && e.which == 87
      //   alert("Ctrl + Alt + C shortcut combination was pressed");
      if (myLayout.root.getItemsById("id_command_Component").length == 0) {
        // let newItemConfig = {
        //     type: "stack",
        //     width: 25.644599303135884,
        //     height : 20,
        //     content: [{
        //         type: 'component',
        //         width : 25.644599303135884,
        //         height : 20,
        //         title : 'Command',
        //         id : "id_command_Component",
        //         componentName: 'command_Component',
        //         componentState: { label: 'command_Component' }
        //     }]
        // };

        let newItemConfig = {
          type: "component",
          width: 25.644599303135884,
          height: 20,
          title: "Command",
          id: "id_command_Component",
          componentName: "command_Component",
          componentState: { label: "command_Component" },
        };
        console.log(myLayout.root.getItemsById("asd"));

        myLayout.root.contentItems[0].addChild(newItemConfig);
        cc.show();
      } else {
        myLayout.root.getItemsById("id_command_Component")[0].remove();
        cc.hide();
      }
    }
  };

  console.log("finish init");

  // read data
  const load = require("../../data/load.json");
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
  const music = load.Music;

  // add simulate page
  const app = new PIXI.Application({
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    backgroundColor: 0x38393d,
  });
  document.getElementById("simulator").appendChild(app.view);

  // manager
  // const mgr = new Manager();
  mgr.setControl(control);

  // simulate display
  const sim = new Simulator(mgr, app, control, load.Texture);

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
});
