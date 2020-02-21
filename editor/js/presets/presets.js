import * as PIXI from 'pixi.js';
import Dancer from '../simulator/dancer.js';
import { LIGHTPARTS, DANCER_NUM, DISPLAY_HEIGHT } from '../constants';
import * as noUiSlider from 'nouislider/distribute/nouislider.js';
import shortid from 'shortid';

const load = require('../../../data/load.json');

class Modal {
    constructor() {
        this.el = document.querySelector('.bg-modal');
        this.display = null;
        this.dancer = null;
        this.sliders = [];
        this.status = {};
        this.init();
    }
    initProps() {
        LIGHTPARTS.map((part) => this.status[part] = 0);
    }
    init() {
        // pre-display
        const height = document.querySelector('.modal-workplace').offsetHeight;
        const width = document.querySelector('.modal-workplace').offsetWidth / 2;
        this.display = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: 0x38393d
        });
        document.querySelector("#modal-display").appendChild(this.display.view);
        this.dancer = new Dancer(0, this.display, load.Texture);
        // this.dancer.setPos(1, height, width);
        // dancerSelect
        for (let i = 0;i < DANCER_NUM; ++i) this.addDancerOpt(i);
        // sliders
        LIGHTPARTS.map((part) => this.addSlider(part));
        this.initProps();
    }

    // ---------- DOM Stuff ----------

    addDancerOpt(id) {
        const opt = document.createElement('option');
        const select = document.querySelector('.modal-select-dancer select .optgrp-2');
        opt.innerHTML = id;
        select.appendChild(opt);
    }

    addSlider(name, value = 0) {
        let el = document.createElement("div");
        let nameText = document.createTextNode(name);
        let lightInput = document.createElement("div");
        lightInput.classList.add("light-input-block");
        let slider = document.createElement("div");
        slider.id = name;
        slider.classList.add("light-slider");
        noUiSlider.create(slider, {
            start: value,
            range: {
                'max': 1,
                'min': 0
            },
            step: 0.1,
            connect: 'lower',
            animate: false,
        })
        // construct Input number
        let numInput = document.createElement("input");
        numInput.classList.add("light-input");
        numInput.setAttribute("type", "number");
        numInput.step = 0.1;
        // handle change function
        slider.noUiSlider.on('update', (value) => {
            numInput.value = value;
            this.status[slider.id] = value;
            this.updateDisplay();
        });
        numInput.addEventListener('change', (e) => {
            slider.noUiSlider.set(e.target.value);
        });
        // append element
        this.sliders.push({slider, numInput});
        lightInput.appendChild(slider);
        lightInput.appendChild(numInput);
        el.appendChild(nameText);
        el.appendChild(lightInput);
        document.querySelector(".modal-slider-list").appendChild(el);
    }
    // ---------- functions ----------
    open() {
        this.el.style.display = 'flex';
        const height = document.querySelector('.modal-workplace').offsetHeight;
        const width = document.querySelector('.modal-workplace').offsetWidth / 2;
        this.display.renderer.resize(width, height);
        this.dancer.setPos(1, height, width);
    }
    close() {
        this.el.style.display = 'none';
    }
    set(preset) {
        const { Name, id, Chosen_Dancer, Dancers, Status } = preset;
        console.log(Name, id, Chosen_Dancer, Dancers, Status);
        document.querySelector('.modal-name-input').value = Name;
        let selectedDancers = [...Dancers];   
        if (Chosen_Dancer) selectedDancers.unshift("Chosen_Dancer");
        $('select[name=modal-select-dancer]').val(selectedDancers);
        $('.selectpicker').selectpicker('refresh');
        this.sliders.map(sliderInput => {
            sliderInput.slider.noUiSlider.set(Status[sliderInput.slider.id]);
        })
    }
    clear() {
        this.initProps();
        this.sliders.map(slider => slider.slider.noUiSlider.set(0));
        document.querySelector('.modal-name-input').value = "";
        $('select[name=modal-select-dancer]').val([]);
        $('.selectpicker').selectpicker('refresh');
    }
    updateDisplay() {
        this.dancer.update(this.status);
    }
    getProps() {
        let re = {};
        re["Name"] = document.querySelector('.modal-name-input').value;
        const selectedDancers = $('.selectpicker').val();
        re["Chosen_Dancer"] = false;
        re["Dancers"] = [];
        selectedDancers.map(val => {
            if (val === "Chosen_Dancer") re["Chosen_Dancer"] = true;
            else re["Dancers"].push(Number(val));
        })
        re["Status"] = {};
        this.sliders.map(sliderInput => {
            re["Status"][sliderInput.slider.id] = Number(sliderInput.slider.noUiSlider.get());
        });
        return re;
    }
}

class Presets {
    constructor(mgr, load = []) {
        this.mode = "";
        this.presetId = "";
        this.mgr = mgr;
        this.presets = load;
        this.modal = new Modal();
        // DOM Stuff
        this.el = document.getElementById('presets');
        this.el.style.height = `${DISPLAY_HEIGHT}px`;
        this.presets.map(preset => this.addPreset(preset));
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
        const presetIcons = document.createElement('div');
        const editIcon = document.createElement('i');
        editIcon.classList.add("fa", "fa-pencil");
        const trashIcon = document.createElement('i');
        trashIcon.classList.add("fa", "fa-trash");
        presetIcons.appendChild(editIcon);
        presetIcons.appendChild(trashIcon);
        li.appendChild(presetIcons);
        document.getElementById("presets-list").appendChild(li);
        // Add click event
        li.ondblclick = e => {
            let preset = null;
            this.presets.map(pre => {
                if (pre["id"] === e.target.id) { preset = pre; }
            });
            this.mgr.loadPreset(preset);
        }
        editIcon.onclick = () => {
            this.mode = "EDIT";
            this.presetId = li.id;
            this.modal.set(preset);
            this.modal.open();
        };
        trashIcon.onclick = () => this.delPreset(li.id);
    }
    refreshPresets() {
        $('.preset-li').remove();
        this.presets.map(preset => this.addPreset(preset));
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
        const ind = this.presets.findIndex(pre => pre["id"] === this.presetId);
        // const preset = presets[ind];
        Object.assign(this.presets[ind], preset);
        console.log("editFinish", this.presets[ind])
        this.refreshPresets();
        this.savePreset();
    }
    delPreset(id) {
        console.log("delPreset", id);
        const ind = this.presets.findIndex(preset => preset["id"] === id);
        this.presets.splice(ind, 1);
        document.querySelector("#presets-list").removeChild(document.querySelector(`#${id}`));
        this.savePreset();
    }
    savePreset() {
        window.localStorage.setItem('presets', JSON.stringify(this.presets));
    }

    // ---------- DOM event ----------
    addClickEvent() {
        document.querySelector("#presets .addbtn").onclick = () => {
            // this.modal.setAddMode();
            this.mode = "ADD";
            this.modal.open();
        }
        document.querySelector(".bg-modal .modal-close-btn").onclick = () => {
            this.mode = "";
            this.modal.close();
            this.modal.clear();
        }
        document.querySelector(".bg-modal .modal-save-btn").onclick = () => {
            this.modal.close();
            if (this.mode === "ADD") {
                this.createPreset(this.modal.getProps());
            }
            else if (this.mode === "EDIT") {
                this.editPreset(this.modal.getProps());
                this.presetId = "";
            }
            this.mode = "";
            this.modal.clear();
        }
    }
}

export default Presets