import { LIGHTPARTS, DANCER_NUM } from '../constants';
import * as noUiSlider from 'nouislider/distribute/nouislider.js';

class Editor {
    constructor(mgr) {
        this.mgr = mgr;
        this.el = document.getElementById('editor');
        this.checkedDancerId = [0];
        // add time and timeInd
        this.timeEl = document.createElement("div");
        this.timeEl.classList.add("time-el");
        this.el.appendChild(this.timeEl);
        this.addTime();
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
            this.addSlider(part, this.mgr.control[this.checkedDancerId[0]][0]["Status"][part]);
        });
        console.log('Editor ', this);
    }

    // -------------------------------------------------------------------------
    //                      Update Component for Editor
    // -------------------------------------------------------------------------

    update() {
        this.updateTime();
        this.updateTimeInd();
        this.updateSlider();
    }

    updateSlider() {
        this.sliders.map(slider => {
            slider.noUiSlider.set(this.mgr.control[this.checkedDancerId[0]][this.mgr.timeInd[this.checkedDancerId[0]]]["Status"][slider.id]);
        });
    }

    updateTime() {
        this.time.children[0].value = this.mgr.time;
    }

    updateTimeInd() {
        console.log("Update Time Ind");
        this.timeEl.children[2].value = this.mgr.timeInd[this.checkedDancerId[0]];
    }

    updateMgrTimeInd(newtimeInd) {
        this.mgr.updateTimeInd(this.checkedDancerId[0], newtimeInd);
    }

    updateDancerChecked(dancerId) {
        if (!this.checkedDancerId.includes(dancerId)) {
            this.checkedDancerId.unshift(dancerId);
            this.update();
            return true;
        }
        if (this.checkedDancerId.length === 1) return false;
        this.checkedDancerId.map((id, index) => {
            if (id === dancerId) {
                this.checkedDancerId.splice(index, 1);
                this.update();
                return true;
            }
        });
        return true;
    }
    // -------------------------------------------------------------------------
    //                       Add Component for Editor
    // -------------------------------------------------------------------------

    addTime() {
        this.time = document.createElement("span");
        this.time.classList.add("time");
        const text = document.createTextNode("Time: ");
        const timeInput = document.createElement("input");
        timeInput.setAttribute("type", "number");
        timeInput.classList.add("time-input");
        timeInput.value = this.mgr.time;
        timeInput.addEventListener('change', e => {
            this.mgr.changeTime(e.target.value);
        });
        this.time.appendChild(text);
        this.time.appendChild(timeInput);
        this.timeEl.append(this.time);
    }

    addTimeInd(timeInd = 0) {
        const leftBtn = document.createElement("button");
        leftBtn.innerHTML = '<i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>';
        leftBtn.classList.add('timeInd-switch-btn');
        leftBtn.onclick = () => this.mgr.timeIndIncrement(-1);
        const rightBtn = document.createElement("button");
        rightBtn.innerHTML = '<i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>';
        rightBtn.classList.add('timeInd-switch-btn');
        rightBtn.onclick = () => this.mgr.timeIndIncrement(1);
        const timeIndInput = document.createElement("input");
        timeIndInput.setAttribute("type", "number");
        timeIndInput.classList.add("timeInd-input");
        timeIndInput.value = timeInd;
        timeIndInput.addEventListener('change', (e) => {
            this.mgr.changeTimeInd(e.target.value);
        });

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
        if (this.checkedDancerId.includes(dancerID)) checkBox.checked = true;
        checkBox.onclick = () => {
            console.log("Checkbox: ", checkBox.value);
            if (!this.updateDancerChecked(Number(checkBox.value))) checkBox.checked = true;
        }
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
            numInput.value = value;
        });
        numInput.addEventListener('change', (e) => {
            slider.noUiSlider.set(e.target.value);
        });
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