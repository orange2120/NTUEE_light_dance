import { DANCER_NUM, FPS } from '../constants';

class Manager {
    constructor() {
        this.time = 0;
        this.timeInd = [];
        for (let i = 0;i < DANCER_NUM; ++i) this.timeInd.push(0);
        this.control = null;
        this.sim = null;
        this.interval = null;
    }
    setControl(control) {  // for global control data
        this.control = control;
        console.log('Manager set control', this.control);
    }
    setSim(sim) {
        this.sim = sim;
        console.log('Manager set simulator', sim);
    }

    setTime(t) {         // for global time
        this.time = t;
        console.log(`Manager set time to ${this.time}`);
    }
    getTime() { return this.time; }
    getControl() { return this.control; }


    getTimeInd(t) {
        // binary search timeInd with this.time
        let re = [];
        for (let i = 0; i < DANCER_NUM; ++i) re.push(0);
        return re;
    }

    initial(t) {
        this.time = t;
        this.timeInd = this.getTimeInd(t);
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
                        this.time = 0;
                        this.timeInd.fill(0);
                        console.log("Stop exec");
                    }
                    else continue;
                }
                if (this.time >= this.control[i][this.timeInd[i] + 1]["Start"]) {
                    this.timeInd[i] += 1;
                    this.sim.update(i, this.timeInd[i]);
                }
            }
        }, 30);
    }
    
}

export default Manager