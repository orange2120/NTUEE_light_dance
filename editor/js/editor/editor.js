import { LIGHTPARTS, DANCER_NUM } from '../constants';
import * as noUiSlider from 'nouislider/distribute/nouislider.js';

class Editor {
    constructor(mgr, control) {
        this.mgr = mgr;
        this.control = control;
        this.el = document.getElementById('editor');
        this.dancerId = 0;
        // add time
        // add timeInd
        this.timeEl = document.createElement("div");
        this.timeEl.classList.add("time-el");
        this.el.appendChild(this.timeEl);
        this.addTimeInd();
        // add dancer checkbox
        this.dancerCheckBox = [];
        this.dancerCheckBoxli = document.createElement("div");
        this.dancerCheckBoxli.classList.add("checkbox-list");
        this.el.appendChild(this.dancerCheckBoxli);
        for (let i = 0;i < DANCER_NUM; ++i) this.addCheckBox(i);
        // add light slider
        this.sliders = [];
        this.sliderli = document.createElement("div");
        this.sliderli.classList.add("slider-list");
        this.el.appendChild(this.sliderli);
        LIGHTPARTS.map((part) => {
            this.addSlider(part, control[this.dancerId][0]["Status"][part]);
        });
        console.log('Editor ', this);
    }

    update() {
        this.updateSlider();
        this.updateTimeInd();
    }

    updateSlider() {
        this.sliders.map(slider => {
            slider.noUiSlider.set(this.control[this.dancerId][this.mgr.timeInd[this.dancerId]]["Status"][slider.id]);
        });
    }

    updateTimeInd() {
        const timeIndInput = this.timeEl.children[1];
        timeIndInput.value = this.mgr.timeInd[this.dancerId];
    }

    addTimeInd(timeInd = 0) {
        const leftBtn = document.createElement("button");
        leftBtn.innerHTML = '<i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>';
        leftBtn.classList.add('timeInd-switch-btn');
        const rightBtn = document.createElement("button");
        rightBtn.innerHTML = 'right';
        rightBtn.innerHTML = '<i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>';
        rightBtn.classList.add('timeInd-switch-btn');
        const timeIndInput = document.createElement("input");
        timeIndInput.setAttribute("type", "number");
        timeIndInput.classList.add("timeInd-input");
        timeIndInput.value = timeInd;

        this.timeEl.appendChild(leftBtn);
        this.timeEl.appendChild(timeIndInput);
        this.timeEl.appendChild(rightBtn);
    }

    addCheckBox(dancerID) {
        const el = document.createElement("div");
        el.classList.add("dancer-checkbox-text");
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.value = dancerID;
        checkBox.classList.add("dancer-checkbox");
        const text = document.createTextNode(dancerID);
        this.dancerCheckBox.push(checkBox);
        el.appendChild(checkBox);
        el.appendChild(text);
        this.dancerCheckBoxli.appendChild(el);
    }

    addSlider(name, value) {
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
            console.log("Slider Update");
            numInput.value = value;
        });
        numInput.addEventListener('change', (e) => {
            console.log("Input change");
            slider.noUiSlider.set(e.target.value);
        })
        // append element
        this.sliders.push(slider);
        lightInput.appendChild(slider);
        lightInput.appendChild(numInput);
        el.appendChild(nameText);
        el.appendChild(lightInput);
        this.sliderli.appendChild(el);
    }
}

export default Editor