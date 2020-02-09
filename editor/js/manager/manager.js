import { DANCER_NUM, FPS } from '../constants';

class Manager {
    constructor() {
        this.time = 0;
        this.timeInd = [];
        for (let i = 0;i < DANCER_NUM; ++i) this.timeInd.push(0);
        this.control = null;
        this.sim = null;
        this.editor = null;
        this.interval = null;
        this.mode = "";
    }
    setControl(control) {  // for global control data
        this.control = control;
        console.log('Manager set control', this.control);
    }
    setSim(sim) {
        this.sim = sim;
        console.log('Manager set simulator', sim);
    }
    setEditor(editor) {
        this.editor = editor;
        console.log('Manager set editor', editor);
    }

    setTime(t) {         // for global time
        this.time = t;
        console.log(`Manager set time to ${this.time}`);
    }
    setEditMode() {
        this.mode = this.mode === "EDIT" ? "" : "EDIT";
        this.editor.update();
        console.log("Set edit mode", this.mode);
    }
    setAddMode() {
        this.mode = this.mode === "ADD" ? "" : "ADD";
        this.editor.update();
        console.log("Set add mode", this.mode);
    }
    delStatus() {

    }

    updateControl(checkedDancerId, name, value) {
        // update control with this.timeInd, this.time
        if (this.mode !== "") {
            console.log("Update Control", checkedDancerId, name, value);
        }
    }

    getTime() { return this.time; }
    getControl() { return this.control; }
    getTimeInd() {
        // binary search timeInd with this.time
        for (let i = 0; i < this.timeInd.length; ++i) {
            let l = 0, r = this.control[i].length - 1;
            let m = Math.floor((l + r + 1) / 2);
            while (l < r) {
                if (this.control[i][m]["Start"] <= this.time) l = m;
                else r = m - 1;
                m = Math.floor((l + r + 1) / 2);
            }
            this.timeInd[i] = m;
        }
    }

    changeTime(newTime) {
        this.time = newTime;
        this.getTimeInd();
        for (let i = 0;i < this.timeInd.length; ++i) {
            this.sim.update(i, this.timeInd[i]);
        }
        this.editor.update();
    }

    timeIndIncrement(num) {
        for (let i = 0;i < this.timeInd.length; ++i) {
            if (this.control[i][this.timeInd[i] + num]) {
                this.timeInd[i] += num;
                this.sim.update(i, this.timeInd[i]);
            }
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.editor.update();
        console.log("TimeIndIncrement", this.timeInd);
    }

    changeTimeInd(val) {
        for (let i = 0;i < this.timeInd.length; ++i) {
            if (this.control[i][val]) {
                this.timeInd[i] = val;
                this.sim.update(i, this.timeInd[i]);
            }
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.editor.update();
        console.log("ChangeTimeInd", val);
    }

    initial(t) {
        this.time = t;
        this.getTimeInd(t);
        for (let i = 0; i < DANCER_NUM; ++i) {
            this.sim.update(i, this.timeInd[i]);
        }
    }

    exec(t) { // Start playing
        this.initial(t);
        this.interval = setInterval(() => {
            this.time += FPS;
            let cnt = 0;
            for (let i = 0; i < DANCER_NUM; ++i) {
                if (!this.control[i][this.timeInd[i] + 1]) {
                    cnt += 1;
                    if (cnt == DANCER_NUM) {
                        // Stop the interval
                        clearInterval(this.interval);
                        this.interval = null;
                        // this.time = 0;
                        // this.timeInd.fill(0);
                        console.log("Stop exec");
                    }
                    else continue;
                }
                if (this.time >= this.control[i][this.timeInd[i] + 1]["Start"]) {
                    this.timeInd[i] += 1;
                    this.editor.update();
                    this.sim.update(i, this.timeInd[i]);
                }
            }
            this.editor.updateTime();
        }, 30);
    }
}

export default Manager