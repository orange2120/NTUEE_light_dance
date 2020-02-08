import { LIGHTPARTS } from '../constants';
import * as noUiSlider from 'nouislider/distribute/nouislider.js';

class Editor {
    constructor(mgr, control) {
        this.mgr = mgr;
        this.control = control;
        this.el = document.getElementById('editor');
        this.dancerId = 7;
        console.log('Editor ', mgr);
        this.sliders = [];
        LIGHTPARTS.map((part) => {
            this.addSlider(part, control[this.dancerId][0]["Status"][part]);
        });
    }

    update() {
        this.updateSlider();
    }

    updateSlider() {
        this.sliders.map(slider => {
            slider.noUiSlider.set(this.control[this.dancerId][this.mgr.timeInd[this.dancerId]]["Status"][slider.id]);
        });
    }

    addSlider(name, value) {
        console.log("AddSlider", name, value);
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
        this.el.appendChild(el);
    }
}

export default Editor