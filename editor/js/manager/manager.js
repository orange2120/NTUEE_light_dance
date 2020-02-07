import { FPS } from '../constants';

class Manager {
    constructor() {
        this.time = 0;
        this.timeInd = 0;
        this.control = null;
        this.timeline = null;
        this.sim = null;
        this.interval = null;
    }
    setControl(control) {  // for global control data
        this.control = control;
        this.timeline = control[0]; // Sample timeline
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


    getTimeInd() {
        // binary search timeInd with this.time
        return 0;
    }

    initial() {
        this.time = 0;
        this.timeInd = 0;
        this.sim.update(this.timeInd);
    }

    exec() { // Start playing
        this.timeInd = this.getTimeInd();
        this.interval = setInterval(() => {
            this.time += FPS;
            if (!this.timeline[this.timeInd + 1]) {
                // Stop the interval
                clearInterval(this.interval);
                this.time = 0;
                this.timeInd = 0;
                this.interval = null;
                console.log("Stop executing", this);
            }
            if (this.time >= this.timeline[this.timeInd + 1]["Start"]) {
                this.timeInd += 1;
                this.sim.update(this.timeInd);
            }
        }, 30);
    }
    
}

export default Manager