import { DANCER_NUM, FPS, LEDPARTS, LIGHTPARTS } from '../constants';

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
    //                             setup
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
            this.mode = "";
        }
        else {
            this.mode = "EDIT";
            this.initNewStatus();
        }
        // this.editor.update();
        this.editor.setSliderMode();
        this.sim.updateAll();
        console.log("Set edit mode", this.mode);
    }
    setAddMode() {
        if (this.mode === "ADD") {
            this.clearStatus();
            this.mode = "";
        }
        else {
            this.mode = "ADD";
            this.initNewStatus();
        }
        // this.editor.update();
        this.editor.setSliderMode();
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
        window.localStorage.setItem('control', JSON.stringify(this.control));
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
        const newTime = this.control[this.editor.checkedDancerId][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.sim.updateAll();
        this.editor.update();
        this.wavesurfer.update();
    }

    editStatus() {
        console.log("Saving newStatus [Edit]", JSON.parse(JSON.stringify(this.newStatus)));
        for (let i = 0;i < DANCER_NUM; ++i) {
            Object.assign(this.control[i][this.timeInd[i]]["Status"], this.newStatus[i]);
        }
        const sampleId = 0;
        if (this.time !== this.control[sampleId][this.timeInd[sampleId]]["Start"]) {
            // console.log("Do you want to change Time to new Time?", this.control[sampleId][this.timeInd[sampleId]]["Start"], this.time);
            let re = window.confirm(`Do you want to change Time to new Time? (${this.time})`);
            if (re === true) {
                console.log("Change to new Time");
                if (this.timeInd[sampleId] != 0 &&
                    this.time < this.control[sampleId][this.timeInd[sampleId] - 1]["Start"]) 
                {
                    window.alert("Error: Can't Change Time!! [newTime smaller than forward Status Start Time]");
                }
                else if (this.timeInd[sampleId] != this.control[sampleId].length - 1 &&
                    this.time > this.control[sampleId][this.timeInd[sampleId] + 1]["Start"])
                {
                    window.alert("Error: Can't Change Time!! [newTime bigger than next Status Start Time]")
                }
                else {
                    for (let i = 0;i < DANCER_NUM; ++i) {
                        this.control[i][this.timeInd[i]]["Start"] = this.time;
                    }
                }
            }
        }
        document.getElementById("editbtn").classList.remove('selected');
        this.setEditMode();
    }

    addStatus() {
        let timeInd = this.getTimeInd();
        console.log("Saving newStatus [Add]", JSON.parse(JSON.stringify(this.newStatus)), this.time, timeInd);
        for (let i = 0;i < DANCER_NUM; ++i) {
            let newControl = {};
            newControl["Start"] = this.time;
            newControl["Status"] = Object.assign({}, this.control[i][timeInd[i]]["Status"], this.newStatus[i]);
            this.control[i].splice(timeInd[i] + 1, 0, newControl);
            this.timeInd[i] = timeInd[i];
        }
        console.log(this.mode)
        // this.sim.updateAll();
        // this.editor.update();
        document.getElementById("addbtn").classList.remove('selected');
        this.setAddMode();
    }

    // -------------------------------------------------------------------------
    //                      Update this.newControl(newStatus)
    // -------------------------------------------------------------------------

    loadPreset(preset) {
        if (this.mode === "") return;
        console.log("Mgr load preset", preset);
        let shouldUpdateDancers = [...preset["Dancers"]];
        let checkedDancerId = this.editor.checkedDancerId;
        if (preset["Chosen_Dancer"] && !shouldUpdateDancers.includes(checkedDancerId))
            shouldUpdateDancers.push(checkedDancerId);
        shouldUpdateDancers.map(id => {
            const status = preset["Status"];
            LIGHTPARTS.map(lightPart => {
                if (status[lightPart]["checked"]) 
                    this.updateControl(id, lightPart, status[lightPart]["value"]);
            });
            LEDPARTS.map(ledPart => {
                if (status[ledPart]["checked"]) {
                    this.updateLEDControlAlpha(id, ledPart, status[ledPart]["alpha"]);
                    this.updateLEDControlTexture(id, ledPart, status[ledPart]["name"]);
                }
            })
        })
    }

    loadScene(scene) {
        if (this.mode === "") return;
        console.log("Mgr load scene", scene);
        for (let id = 0; id < DANCER_NUM; ++id) {
            const status = scene["status"][id];
            LIGHTPARTS.map(lightPart => {
                this.updateControl(id, lightPart, status[lightPart]);
            });
            LEDPARTS.map(ledPart => {
                this.updateLEDControlAlpha(id, ledPart, status[ledPart]["alpha"]);
                this.updateLEDControlTexture(id, ledPart, status[ledPart]["name"]);
            });
        }

    }

    initNewStatus() {
        for (let i = 0;i < DANCER_NUM; ++i) {
            this.newStatus[i] = JSON.parse(JSON.stringify(this.control[i][this.timeInd[i]]["Status"]));
        }
        console.log("initNewStatus", this.newStatus)
    }

    updateControl(checkedDancerId, name, value) {
        // update control with this.timeInd, this.time
        if (this.mode !== "") {
            // console.log("Update Control", checkedDancerId, name, value, this.newStatus);
            const id = checkedDancerId;
            this.newStatus[id][name] = value;
            this.sim.updateEdit(checkedDancerId);
        }
        else {
            console.error(`Error: [updateControl], mode: ${this.mode}`);
        }
    }
    updateLEDControlAlpha(checkedDancerId, part, alpha) {
        if (this.mode !== "") {
            const id = checkedDancerId;
            this.newStatus[id][part]["alpha"] = alpha;
            this.sim.updateEdit(checkedDancerId);
            // console.log("Update LED Control Alpha", checkedDancerId, part, alpha, this.newStatus);
        }
        else {
            console.error(`Error: [updateLEDControl], mode: ${this.mode}`);
        }
    }
    updateLEDControlTexture(checkedDancerId, part, textureName) {
        // update control with this.timeInd, this.time
        if (this.mode !== "") {
            const id = checkedDancerId;
            this.newStatus[id][part]["name"] = textureName;
            this.sim.updateEdit(checkedDancerId);
            // console.log("Update LED Control TextureName", checkedDancerId, part, textureName, this.newStatus);
        }
        else {
            console.error(`Error: [updateLEDControl], mode: ${this.mode}`);
        }
    }

    clearStatus() {
        for (let i = 0;i < this.newStatus.length; ++i) this.newStatus[i] = {};
    }

    // -------------------------------------------------------------------------
    //                      Update this.time
    // -------------------------------------------------------------------------

    changeTime(newTime, playing = false) {
        // console.log("changeTime", newTime, playing);
        this.time = newTime;
        this.editor.updateTime();
        if (this.mode !== "") {
            this.editor.update();
            this.wavesurfer.update();
            return;
        }
        if (playing) {
            let update = 0;
            for (let i = 0; i < DANCER_NUM; ++i) {
                if (!this.control[i][this.timeInd[i] + 1]) {
                    continue;
                }
                if (this.time >= this.control[i][this.timeInd[i] + 1]["Start"]) {
                    this.timeInd[i] += 1;
                    this.sim.update(i, this.timeInd[i]);
                    update = 1;
                }
            }
            if (update) {
                console.log("Playing to new Status");
                this.editor.updateTimeInd();
                // this.wavesurfer.update();
            }
        }
        else {
            // console.log("Change Time when not playing")
            let re = this.getTimeInd();
            for (let i = 0;i < this.timeInd.length; ++i) {
                this.timeInd[i] = re[i];
                this.sim.update(i, this.timeInd[i]);
            }
            this.editor.update();
            this.wavesurfer.update();
        }
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
        const newTime = this.control[this.editor.checkedDancerId][this.timeInd[0]]["Start"]
        this.time = newTime === undefined ? this.time : newTime;
        this.editor.update();
        this.wavesurfer.update();
        // console.log("TimeIndIncrement", this.timeInd);
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
        const newTime = this.control[this.editor.checkedDancerId][this.timeInd[0]]["Start"]
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
    changeExecTime(t) {
        this.time = t;

    }
    stopExec() {
        console.log("Stop Exec");
        if (this.interval) clearInterval(this.interval);
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
    // -------------------------------------------------------------------------
    //                      Download control
    // -------------------------------------------------------------------------
    upload(e) {
        try {
            let files = e.target.files;  
            let fr = new FileReader(); 
            fr.onload = evt => {
                let re = JSON.parse(evt.target.result);
                this.control = re;
                console.log("upload new control", this.control);
            };
            fr.readAsText(files[0]);
        }
        catch (err) {
            console.error(err);
        }
    }
    download() {
        console.log("Download file", this.control);
        const downloadLink = document.getElementById('download-link');
        let data = `text/json;charset=utf-8,` + encodeURIComponent(JSON.stringify(this.control));
        downloadLink.href = `data:${data}`;
        downloadLink.download = "control.json";
    }
}

export default Manager