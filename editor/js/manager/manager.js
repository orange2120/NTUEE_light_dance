import { DANCER_NUM, FPS } from '../constants';

class Manager {
    constructor() {
        this.time = 0;
        this.timeInd = [];
        for (let i = 0;i < DANCER_NUM; ++i) this.timeInd.push(0);
        this.control = null;
        this.sim = null;
        this.editor = null;
        this.timeliner = null;
        this.wavesurfer = null;
        this.interval = null;
        this.mode = "";
        this.newStatus = []; // new Status for edit
        for (let i = 0;i < DANCER_NUM; ++i) this.newStatus.push({});
    }

    // -------------------------------------------------------------------------
    //                      Initial setup
    // -------------------------------------------------------------------------
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
    setTimerliner(timeliner) {
        this.timeliner = timeliner;
        console.log('Manager set timeliner', timeliner);
    }
    setWaveSurfer(wavesurfer) {
        this.wavesurfer = wavesurfer;
        console.log('Manager set wavesurfer', wavesurfer);
    }

    setTime(t) {         // for global time
        this.time = t;
        console.log(`Manager set time to ${this.time}`);
    }
    setEditMode() {
        if (this.mode === "EDIT") {
            this.clearStatus();
        }
        this.mode = this.mode === "EDIT" ? "" : "EDIT";
        this.editor.update();
        this.sim.updateAll();
        console.log("Set edit mode", this.mode);
    }
    setAddMode() {
        if (this.mode === "ADD") {
            this.clearStatus();
        }
        this.mode = this.mode === "ADD" ? "" : "ADD";
        this.editor.update();
        this.sim.updateAll();
        console.log("Set add mode", this.mode);
    }

    // -------------------------------------------------------------------------
    //                              Utility
    // -------------------------------------------------------------------------
    
    getTime() { return this.time; }
    getControl() { return this.control; }
    getTimeInd() {
        let re = [];
        // binary search timeInd with this.time
        for (let i = 0; i < this.timeInd.length; ++i) {
            let l = 0, r = this.control[i].length - 1;
            let m = Math.floor((l + r + 1) / 2);
            while (l < r) {
                if (this.control[i][m]["Start"] <= this.time) l = m;
                else r = m - 1;
                m = Math.floor((l + r + 1) / 2);
            }
            // this.timeInd[i] = m;
            re.push(m);
        }
        return re;
    }
    // -------------------------------------------------------------------------
    //                              Call by timeliner
    // -------------------------------------------------------------------------
    getTimeFromTimeliner(t) { 
        // Call by this.timeliner
        console.log("Get time from timeliner!!", t * 1000);    // turn s to ms
    }

    getTimeIndFromTimeliner(obj) {
        console.log("Get timeliner from timeliner!!", obj);
    }

    // -------------------------------------------------------------------------
    //                      Update this.control
    // -------------------------------------------------------------------------
    saveNewStatus() {
        if (this.mode === "EDIT") this.editStatus();
        else if (this.mode === "ADD") this.addStatus();
    }

    delStatus() {
        console.log("Deleting Status");
        for (let i = 0; i < DANCER_NUM; ++i) {
            if (this.timeInd[i] == 0) {
                console.log("Can't delete Status 0!!");
                continue;
            }
            this.control[i].splice(this.timeInd[i], 1);
            this.timeInd[i] -= 1;
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.sim.updateAll();
        this.editor.update();
        this.wavesurfer.update();
    }

    editStatus() {
        console.log("Saving newStatus [Edit]");
        for (let i = 0;i < DANCER_NUM; ++i) {
            Object.assign(this.control[i][this.timeInd[i]]["Status"], this.newStatus[i]);
        }
    }

    addStatus() {
        console.log("Saving newStatus [Add]", this.newStatus);
        for (let i = 0;i < DANCER_NUM; ++i) {
            let newControl = {};
            newControl["Start"] = this.time;
            newControl["Status"] = Object.assign({}, this.control[i][this.timeInd[i]]["Status"], this.newStatus[i]);
            this.control[i].splice(this.timeInd[i] + 1, 0, newControl);
            this.timeInd[i] += 1;
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.sim.updateAll();
        this.editor.update();
        this.wavesurfer.update();
    }

    // -------------------------------------------------------------------------
    //                      Update this.newControl(newStatus)
    // -------------------------------------------------------------------------

    updateControl(checkedDancerId, name, value) {
        // update control with this.timeInd, this.time
        if (this.mode !== "") {
            checkedDancerId.map(id => {
                this.newStatus[id] = Object.assign({}, this.control[id][this.timeInd[id]]["Status"], this.newStatus[id]);
                this.newStatus[id][name] = Number(value);
            });
            this.sim.updateEdit(checkedDancerId);
            console.log("Update Control", checkedDancerId, name, value, this.newStatus);
        }
        else {
            console.error(`Error: [updateControl], mode: ${this.mode}`);
        }
    }

    clearStatus() {
        for (let i = 0;i < this.newStatus.length; ++i) this.newStatus[i] = {};
    }

    // -------------------------------------------------------------------------
    //                      Update this.time
    // -------------------------------------------------------------------------

    changeTime(newTime) {
        console.log("changeTime", newTime);
        this.time = newTime;
        let re = this.getTimeInd();
        for (let i = 0;i < this.timeInd.length; ++i) {
            this.timeInd[i] = re[i];
            this.sim.update(i, this.timeInd[i]);
        }
        this.editor.update();
        this.wavesurfer.update();
        // this.timeliner.setCurrentTime(Number.parseFloat(newTime) / 1000);
    }

    // -------------------------------------------------------------------------
    //                      Update this.timeInd
    // -------------------------------------------------------------------------

    timeIndIncrement(num) {
        if (this.mode !== "") {
            console.log("Error: Can't change TimeInd at edit/add mode!!!");
            return;
        }
        for (let i = 0;i < this.timeInd.length; ++i) {
            if (this.control[i][this.timeInd[i] + num]) {
                this.timeInd[i] += num;
                this.sim.update(i, this.timeInd[i]);
            }
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.editor.update();
        this.wavesurfer.update();
        console.log("TimeIndIncrement", this.timeInd);
    }

    changeTimeInd(val) {
        if (this.mode !== "") {
            console.log("Error: Can't change TimeInd at edit/add mode!!!");
            return;
        }
        for (let i = 0;i < this.timeInd.length; ++i) {
            if (this.control[i][val]) {
                this.timeInd[i] = Number(val);
                this.sim.update(i, this.timeInd[i]);
            }
        }
        const newTime = this.control[this.editor.checkedDancerId[0]][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.editor.update();
        console.log("ChangeTimeInd", val);
    }

    // -------------------------------------------------------------------------
    //                      for running control
    // -------------------------------------------------------------------------

    initial(t) {
        this.time = t;
        this.timeInd = this.getTimeInd(t).slice();
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