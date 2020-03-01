import { LIGHTPARTS, DANCER_NUM, LEDPARTS } from '../constants';
import * as noUiSlider from 'nouislider/distribute/nouislider.js';
import { style } from 'wavesurfer.js';

class Editor {
    constructor(mgr, loadTexture) {
        this.mgr = mgr;
        this.loadTexture = loadTexture;
        this.el = document.getElementById('editor');
        this.checkedDancerId = 0;
        // add time and timeInd
        this.addTime();
        this.addTimeInd();
        // add dancer checkbox
        this.dancerCheckBox = [];
        for (let i = 0;i < DANCER_NUM; ++i) this.addCheckBox(i);
        // add edit button
        this.addEditBtn();
        // add light slider
        this.sliders = [];
        LIGHTPARTS.map((part) => {
            this.addSlider(part, this.mgr.control[this.checkedDancerId][0]["Status"][part]);
        });
        // add LED slider
        this.LEDsliders = [];
        LEDPARTS.map(part => {
            this.addLEDInput(part, this.mgr.control[this.checkedDancerId][0]["Status"][part]);
        });
        // add upload
        this.addUpload();
        // add download
        this.addDownloadBtn();
        console.log('Editor ', this);
    }

    // -------------------------------------------------------------------------
    //                      Update Component for Editor
    // -------------------------------------------------------------------------

    update() {
        this.updateTime();
        this.updateTimeInd();
        this.updateSlider();
        // this.setSliderMode();
    }

    updateSlider() {
        // console.log("updateSlider", this.mgr.mode);
        if (this.mgr.mode === "") {
            this.sliders.map(sliderInput => {
                const id = this.checkedDancerId;
                sliderInput.slider.noUiSlider
                    .set(this.mgr.control[id][this.mgr.timeInd[id]]["Status"][sliderInput.slider.id]);
            });
            this.LEDsliders.map(LEDInput => {
                const id = this.checkedDancerId;
                LEDInput.selector.value = this.mgr.control[id][this.mgr.timeInd[id]]["Status"][LEDInput.slider.id]["name"];
                LEDInput.slider.noUiSlider
                    .set(this.mgr.control[id][this.mgr.timeInd[id]]["Status"][LEDInput.slider.id]["alpha"]);
                $('.selectpicker').selectpicker('refresh');
            });
        }
        else {
            console.log("updateSlider in edit/add mode", this.mgr.newStatus)
            this.sliders.map(sliderInput => {
                sliderInput.slider.noUiSlider
                    .set(this.mgr.newStatus[this.checkedDancerId][sliderInput.slider.id]);
            });
            this.LEDsliders.map(LEDInput => {
                const id = this.checkedDancerId;
                LEDInput.selector.value = this.mgr.newStatus[id][LEDInput.slider.id]["name"];
                $('.selectpicker').selectpicker('refresh');
                LEDInput.slider.noUiSlider
                    .set(this.mgr.newStatus[id][LEDInput.slider.id]["alpha"]);
            });
        }
    }

    updateTime() {
        // console.log("Update Time");
        document.getElementsByClassName("time-input")[0].value = this.mgr.time;
    }

    updateTimeInd() {
        // console.log("Update Time Ind");
        document.getElementsByClassName("timeInd-input")[0].value = this.mgr.timeInd[this.checkedDancerId];
    }

    updateMgrTimeInd(newtimeInd) {
        this.mgr.updateTimeInd(this.checkedDancerId, newtimeInd);
    }

    updateDancerChecked(dancerId) {
        console.log("updateDancerChecked", dancerId, this.mgr.newStatus);
        this.checkedDancerId = Number(dancerId);
        this.updateSlider();
        // if (!this.checkedDancerId.includes(dancerId)) {
        //     this.checkedDancerId.unshift(dancerId);
        //     this.updateSlider();
        //     return true;
        // }
        // if (this.checkedDancerId.length === 1) return false;
        // this.checkedDancerId.map((id, index) => {
        //     if (id === dancerId) {
        //         this.checkedDancerId.splice(index, 1);
        //         this.updateSlider();
        //         return true;
        //     }
        // });
        // return true;
    }

    // -------------------------------------------------------------------------
    //                       Set Component for Editor
    // -------------------------------------------------------------------------
    setSliderMode() {
        this.sliders.map(sliderInput => {
            if (this.mgr.mode !== "") {
                sliderInput.slider.removeAttribute("disabled");
                sliderInput.numInput.removeAttribute("disabled");
            }
            else {
                sliderInput.slider.setAttribute("disabled", true);
                sliderInput.numInput.setAttribute("disabled", true);

            }
        });
        this.LEDsliders.map(sliderInput => {
            if (this.mgr.mode !== "") {
                sliderInput.slider.removeAttribute("disabled");
                sliderInput.numInput.removeAttribute("disabled");
            }
            else {
                sliderInput.slider.setAttribute("disabled", true);
                sliderInput.numInput.setAttribute("disabled", true);

            }
        });
    }

    // -------------------------------------------------------------------------
    //                       Add Component for Editor
    // -------------------------------------------------------------------------

    addTime() {
        const timeInput = document.getElementsByClassName("time-input")[0];
        timeInput.classList.add("time-input");
        timeInput.value = this.mgr.time;
        timeInput.addEventListener('change', e => {
            this.mgr.changeTime(e.target.value);
        });
    }

    addTimeInd(timeInd = 0) {
        const leftBtn = document.getElementById("timeInd-left-btn");
        leftBtn.onclick = () => this.mgr.timeIndIncrement(-1);
        const rightBtn = document.getElementById("timeInd-right-btn");
        rightBtn.onclick = () => this.mgr.timeIndIncrement(1);
        const timeIndInput = document.getElementsByClassName("timeInd-input")[0];
        timeIndInput.value = timeInd;
        timeIndInput.addEventListener('change', (e) => {
            this.mgr.changeTimeInd(e.target.value);
        });
    }

    addEditBtn() {
        const editBtn = document.getElementById("editbtn");
        const addBtn = document.getElementById("addbtn");
        const delBtn = document.getElementById("delbtn");
        const saveBtn = document.getElementById("savebtn");

        delBtn.onclick = () => this.mgr.delStatus();

        editBtn.onclick = () => {
            editBtn.classList.toggle("selected");
            addBtn.classList.remove("selected");
            this.mgr.setEditMode();
            this.setSliderMode();
        }
        addBtn.onclick = () => {
            addBtn.classList.toggle("selected");
            editBtn.classList.remove("selected");
            this.mgr.setAddMode();
            this.setSliderMode();
        }
        saveBtn.onclick = () => {
            this.mgr.saveNewStatus();
        }
    }

    addCheckBox(dancerID) {
        const el = document.createElement("div");
        el.classList.add("dancer-checkbox-text");
        const checkBox = document.createElement("input");
        checkBox.type = "radio";
        checkBox.name = "dancer-check-box"
        checkBox.value = dancerID;
        checkBox.classList.add("dancer-checkbox");
        if (this.checkedDancerId === dancerID) checkBox.checked = true;
        checkBox.onclick = () => {
            console.log("Checkbox: ", checkBox.value);
            // if (!this.updateDancerChecked(Number(checkBox.value))) checkBox.checked = true;
            this.updateDancerChecked(checkBox.value);
        }
        const text = document.createTextNode(dancerID);
        this.dancerCheckBox.push(checkBox);
        el.appendChild(checkBox);
        el.appendChild(text);
        document.getElementById("dancer-checkbox-list").appendChild(el);
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
        slider.setAttribute('disabled', true);
        // construct Input number
        let numInput = document.createElement("input");
        numInput.classList.add("light-input");
        numInput.setAttribute("type", "number");
        numInput.step = 0.1;
        numInput.setAttribute('disabled', true);
        // handle change function
        slider.noUiSlider.on('update', (value) => {
            numInput.value = value;
            if (this.mgr.mode !== "") this.mgr.updateControl(this.checkedDancerId, slider.id, Number(value));
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
        document.getElementById("slider-list").appendChild(el);
    }
    addLEDInput(part, {name, alpha}) {
        // console.log("AddLEDInput:", part, name, alpha, this.loadTexture[part]);
        // let textureName = name;
        const options = this.loadTexture[part];
        
        let el = document.createElement("div");
        let nameText = document.createTextNode(part);
        let lightInput = document.createElement("div");
        lightInput.classList.add("light-input-block");
        let slider = document.createElement("div");
        slider.id = part;
        slider.classList.add("light-slider");
        noUiSlider.create(slider, {
            start: alpha,
            range: {
                'max': 1,
                'min': 0
            },
            step: 0.1,
            connect: 'lower',
            animate: false,
        })
        slider.setAttribute('disabled', true);
        // construct Input number
        let numInput = document.createElement("input");
        numInput.classList.add("light-input");
        numInput.setAttribute("type", "number");
        numInput.step = 0.1;
        numInput.setAttribute('disabled', true);
        // handle change function
        slider.noUiSlider.on('update', (value) => {
            numInput.value = value;
            if (this.mgr.mode !== "") this.mgr.updateLEDControlAlpha(this.checkedDancerId, slider.id, Number(value));
        });
        numInput.addEventListener('change', (e) => {
            slider.noUiSlider.set(e.target.value);
        });

        // add LED texture selector
        const selector = document.createElement('select');
        selector.classList.add("selectpicker", "LED-select");
        selector.id = `${part}-selector`;
        // selector.setAttribute("data-style","bg-white");
        options.map(opt => {
            let optEl = document.createElement("option");
            optEl.innerHTML = opt;
            optEl.value = opt;
            selector.appendChild(optEl);
        });
        selector.value = name;
        $('.selectpicker').selectpicker('refresh');
        // handle LED change function
        selector.onchange = () => {
            // name = selector.value;
            this.mgr.updateLEDControlTexture(this.checkedDancerId, slider.id, selector.value);
        }

        this.LEDsliders.push({slider, numInput, selector});
        // append element
        lightInput.appendChild(slider);
        lightInput.appendChild(numInput);
        lightInput.appendChild(selector);
        el.appendChild(nameText);
        el.appendChild(lightInput);
        document.getElementById("slider-list").appendChild(el);
    }

    addUpload() {
        document.getElementById("upload-file").onchange = (e) => {
            this.mgr.upload(e);
            let filename = e.target.value.split("\\").pop()
            document.querySelector('#upload-file').nextElementSibling.innerHTML = filename;

        }
    }

    addDownloadBtn() {
        // console.log("addDownloadBtn")
        document.getElementById("download-link").onclick = (e) => this.mgr.download();
    }
}

export default Editor