import * as PIXI from "pixi.js";
import Dancer from "../simulator/dancer.js";
import { LIGHTPARTS, LEDPARTS, DANCER_NUM } from "../constants";
import * as noUiSlider from "nouislider/distribute/nouislider.js";
import shortid from "shortid";

const load = require("../../../data/load.json");

class Modal {
  constructor(loadTexture) {
    this.el = document.querySelector(".bg-modal");
    this.display = null;
    this.dancer = null;
    this.sliders = [];
    this.LEDsliders = [];
    this.status = {};
    this.loadTexture = loadTexture;
    this.init();
  }
  initProps() {
    LIGHTPARTS.map((part) => (this.status[part] = 0));
    LEDPARTS.map((part) => (this.status[part] = { name: "", alpha: 0 }));
  }
  init() {
    this.initProps();
    // pre-display
    const height = document.querySelector(".modal-workplace").offsetHeight;
    const width = document.querySelector(".modal-workplace").offsetWidth / 2;
    this.display = new PIXI.Application({
      width: width,
      height: height,
      backgroundColor: 0x38393d,
    });
    document.querySelector("#modal-display").appendChild(this.display.view);
    this.dancer = new Dancer(0, this.display, load.Texture);
    // this.dancer.setPos(1, height, width);
    // dancerSelect
    for (let i = 0; i < DANCER_NUM; ++i) this.addDancerOpt(i);
    // sliders
    LIGHTPARTS.map((part) => this.addSlider(part, this.status[part], false));
    LEDPARTS.map((part) => this.addLEDInput(part, this.status[part], false));
  }

  // ---------- DOM Stuff ----------

  addDancerOpt(id) {
    const opt = document.createElement("option");
    const select = document.querySelector(
      ".modal-select-dancer select .optgrp-2"
    );
    opt.innerHTML = id;
    select.appendChild(opt);
  }

  addSlider(name, value, checked) {
    let el = document.createElement("div");
    let nameText = document.createTextNode(name);
    let lightInput = document.createElement("div");
    lightInput.classList.add("light-input-block");
    // construct checkbox
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.value = name;
    checkBox.checked = checked;
    checkBox.style.margin = "0px 3px 0px 0px";
    // construct slider
    let slider = document.createElement("div");
    slider.id = name;
    slider.classList.add("light-slider");
    noUiSlider.create(slider, {
      start: value,
      range: {
        max: 1,
        min: 0,
      },
      step: 0.1,
      connect: "lower",
      animate: false,
    });
    if (!checked) slider.setAttribute("disabled", true);
    // construct Input number
    let numInput = document.createElement("input");
    numInput.classList.add("light-input");
    numInput.setAttribute("type", "number");
    numInput.step = 0.1;
    if (!checked) numInput.setAttribute("disabled", true);
    // handle change function
    slider.noUiSlider.on("update", (value) => {
      numInput.value = value;
      this.status[slider.id] = Number(value);
      this.updateDisplay();
    });
    numInput.addEventListener("change", (e) => {
      slider.noUiSlider.set(e.target.value);
    });
    checkBox.onchange = (e) => {
      if (e.target.checked) {
        slider.removeAttribute("disabled");
        numInput.removeAttribute("disabled");
      } else {
        slider.setAttribute("disabled", true);
        numInput.setAttribute("disabled", true);
      }
    };
    // append element
    this.sliders.push({ slider, numInput, checkBox });
    lightInput.appendChild(slider);
    lightInput.appendChild(numInput);
    el.appendChild(checkBox);
    el.appendChild(nameText);
    el.appendChild(lightInput);
    document.querySelector(".modal-slider-list").appendChild(el);
  }
  addLEDInput(part, { name, alpha }, checked) {
    // console.log("AddLEDInput:", part, name, alpha, this.loadTexture[part]);
    // let textureName = name;
    const options = this.loadTexture[part];

    let el = document.createElement("div");
    let nameText = document.createTextNode(part);
    let lightInput = document.createElement("div");
    lightInput.classList.add("light-input-block");
    // construct checkbox
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.value = name;
    checkBox.checked = checked;
    checkBox.style.margin = "0px 3px 0px 0px";
    // construct slider
    let slider = document.createElement("div");
    slider.id = part;
    slider.classList.add("light-slider");
    noUiSlider.create(slider, {
      start: alpha,
      range: {
        max: 1,
        min: 0,
      },
      step: 0.1,
      connect: "lower",
      animate: false,
    });
    if (!checked) slider.setAttribute("disabled", true);

    // construct Input number
    let numInput = document.createElement("input");
    numInput.classList.add("light-input");
    numInput.setAttribute("type", "number");
    numInput.step = 0.1;
    if (!checked) numInput.setAttribute("disabled", true);

    // add LED texture selector
    const selector = document.createElement("select");
    selector.classList.add("selectpicker", "LED-select");
    selector.id = `${part}-selector`;
    // selector.setAttribute("data-style","bg-white");
    options.map((opt) => {
      let optEl = document.createElement("option");
      optEl.innerHTML = opt;
      optEl.value = opt;
      selector.appendChild(optEl);
    });
    selector.value = name;
    $(".selectpicker").selectpicker("refresh");
    // if (!checked) selector.setAttribute("disabled", true);

    // handle LED change function
    selector.onchange = (e) => {
      this.status[slider.id]["name"] = e.target.value;
      this.updateDisplay();
    };
    // handle Light change function
    slider.noUiSlider.on("update", (value) => {
      numInput.value = value;
      this.status[slider.id]["alpha"] = Number(value);
      this.updateDisplay();
    });
    numInput.addEventListener("change", (e) => {
      slider.noUiSlider.set(e.target.value);
    });
    checkBox.onchange = (e) => {
      if (e.target.checked) {
        slider.removeAttribute("disabled");
        numInput.removeAttribute("disabled");
        // selector.removeAttribute("disabled");
      } else {
        slider.setAttribute("disabled", true);
        numInput.setAttribute("disabled", true);
        // selector.setAttribute("disabled", true);
      }
    };

    this.LEDsliders.push({ slider, numInput, selector, checkBox });
    // append element
    lightInput.appendChild(checkBox);
    lightInput.appendChild(slider);
    lightInput.appendChild(numInput);
    // lightInput.appendChild(selector);
    el.appendChild(nameText);
    el.appendChild(lightInput);
    el.appendChild(selector);
    document.querySelector(".modal-slider-list").appendChild(el);
  }

  // ---------- functions ----------
  open() {
    this.el.style.display = "flex";
    const height = document.querySelector(".modal-workplace").offsetHeight;
    const width = document.querySelector(".modal-workplace").offsetWidth / 2;
    this.display.renderer.resize(width, height);
    this.dancer.setPos(1, height, width);
  }
  close() {
    this.el.style.display = "none";
  }
  set(preset) {
    const { Name, id, Chosen_Dancer, Dancers, Status } = preset;
    console.log(Name, id, Chosen_Dancer, Dancers, Status);
    document.querySelector(".modal-name-input").value = Name;
    let selectedDancers = [...Dancers];
    if (Chosen_Dancer) selectedDancers.unshift("Chosen_Dancer");
    $("select[name=modal-select-dancer]").val(selectedDancers);
    this.sliders.map((sliderInput) => {
      const { slider, numInput, checkBox } = sliderInput;
      slider.noUiSlider.set(Status[slider.id]["value"]);
      checkBox.checked = Status[slider.id]["checked"];
      if (checkBox.checked) {
        slider.removeAttribute("disabled");
        numInput.removeAttribute("disabled");
      } else {
        slider.setAttribute("disabled", true);
        numInput.setAttribute("disabled", true);
      }
      this.status[slider.id] = Status[slider.id]["value"];
    });
    this.LEDsliders.map((LEDInput) => {
      const { slider, numInput, selector, checkBox } = LEDInput;
      slider.noUiSlider.set(Status[slider.id]["alpha"]);
      selector.value = Status[slider.id]["name"];
      checkBox.checked = Status[slider.id]["checked"];
      if (checkBox.checked) {
        slider.removeAttribute("disabled");
        numInput.removeAttribute("disabled");
        // selector.removeAttribute("disabled");
      } else {
        slider.setAttribute("disabled", true);
        numInput.setAttribute("disabled", true);
        // selector.setAttribute("disabled", true);
      }
      this.status[slider.id] = {
        name: Status[slider.id]["name"],
        alpha: Status[slider.id]["alpha"],
      };
    });
    $(".selectpicker").selectpicker("refresh");
    this.updateDisplay();
  }
  clear() {
    this.initProps();
    this.sliders.map((slider) => {
      slider.slider.noUiSlider.set(0);
      slider.checkBox.checked = false;
    });
    this.LEDsliders.map((LEDInput) => {
      LEDInput.slider.noUiSlider.set(0);
      LEDInput.selector.value = "";
      LEDInput.checkBox.checked = false;
    });
    document.querySelector(".modal-name-input").value = "";
    $("select[name=modal-select-dancer]").val([]);
    $(".selectpicker").selectpicker("refresh");
  }
  updateDisplay() {
    this.dancer.update(this.status);
  }
  getProps() {
    let re = {};
    re["Name"] = document.querySelector(".modal-name-input").value;
    const selectedDancers = $(".selectpicker[name=modal-select-dancer]").val();
    re["Chosen_Dancer"] = false;
    re["Dancers"] = [];
    selectedDancers.map((val) => {
      if (val === "Chosen_Dancer") re["Chosen_Dancer"] = true;
      else re["Dancers"].push(Number(val));
    });
    re["Status"] = {};
    this.sliders.map((sliderInput) => {
      re["Status"][sliderInput.slider.id] = {
        value: Number(sliderInput.slider.noUiSlider.get()),
        checked: sliderInput.checkBox.checked,
      };
    });
    this.LEDsliders.map((LEDInput) => {
      re["Status"][LEDInput.slider.id] = {
        name: LEDInput.selector.value,
        alpha: Number(LEDInput.slider.noUiSlider.get()),
        checked: LEDInput.checkBox.checked,
      };
    });
    return re;
  }
}

class Presets {
  constructor(mgr, presets, loadTexture) {
    this.mode = "";
    this.presetId = "";
    this.mgr = mgr;
    this.presets = presets;
    this.modal = new Modal(loadTexture);
    // DOM Stuff
    this.el = document.getElementById("presets");
    this.presets.map((preset) => this.addPreset(preset));
    this.addClickEvent();
  }
  addPreset(preset) {
    const name = preset["Name"];
    // const dancers = preset["dancers"];
    // DOM stuff
    const li = document.createElement("div");
    li.classList.add("preset-li");
    li.id = preset["id"];
    li.innerText = name;
    const presetIcons = document.createElement("div");
    const editIcon = document.createElement("div");
    editIcon.innerHTML = '<i class="fas fa-edit"></i>';
    // editIcon.classList.add("fas", "fa-edit");
    const trashIcon = document.createElement("div");
    trashIcon.innerHTML = '<i class="fas fa-trash"></i>';
    // trashIcon.classList.add("fas", "fa-trash");
    presetIcons.style.display = "flex";
    presetIcons.appendChild(editIcon);
    presetIcons.appendChild(trashIcon);
    li.appendChild(presetIcons);
    document.getElementById("presets-list").appendChild(li);
    // Add click event
    li.ondblclick = (e) => {
      let preset = null;
      this.presets.map((pre) => {
        if (pre["id"] === e.target.id) {
          preset = pre;
        }
      });
      this.mgr.loadPreset(preset);
    };
    editIcon.onclick = (e) => {
      console.log("Edit icon");
      this.mode = "EDIT";
      this.presetId = li.id;
      this.modal.set(preset);
      this.modal.open();
    };
    trashIcon.onclick = () => this.delPreset(li.id);
  }
  refreshPresets() {
    $(".preset-li").remove();
    this.presets.map((preset) => this.addPreset(preset));
  }

  createPreset(preset) {
    if (preset["Name"] === "") return;
    preset["id"] = shortid.generate();
    console.log(preset);
    this.presets.push(preset);
    this.addPreset(preset);
    this.savePreset();
  }
  editPreset(preset) {
    console.log("editPreset", preset);
    const ind = this.presets.findIndex((pre) => pre["id"] === this.presetId);
    // const preset = presets[ind];
    Object.assign(this.presets[ind], preset);
    console.log("editFinish", this.presets[ind]);
    this.refreshPresets();
    this.savePreset();
  }
  delPreset(id) {
    console.log("delPreset", id);
    const ind = this.presets.findIndex((preset) => preset["id"] === id);
    this.presets.splice(ind, 1);
    document
      .querySelector("#presets-list")
      .removeChild(document.querySelector(`#${id}`));
    this.savePreset();
  }
  savePreset() {
    window.localStorage.setItem("presets", JSON.stringify(this.presets));
  }

  // ---------- DOM event ----------
  addClickEvent() {
    document.querySelector(".presets-addbtn").onclick = () => {
      // this.modal.setAddMode();
      this.mode = "ADD";
      this.modal.open();
    };
    document.querySelector(".bg-modal .modal-close-btn").onclick = () => {
      this.mode = "";
      this.modal.close();
      this.modal.clear();
    };
    document.querySelector(".bg-modal .modal-save-btn").onclick = () => {
      this.modal.close();
      if (this.mode === "ADD") {
        this.createPreset(this.modal.getProps());
      } else if (this.mode === "EDIT") {
        this.editPreset(this.modal.getProps());
        this.presetId = "";
      }
      this.mode = "";
      this.modal.clear();
    };
  }
}

export default Presets;
