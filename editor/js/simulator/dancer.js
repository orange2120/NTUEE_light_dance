import PIXI from 'pixi.js'
import { Part, LEDPart } from './part.js'

class Dancer {
    constructor(id, timeline, app, loadTexture) {
        console.log(`Construct Dacner ${id} with`, timeline);
        this.app = app;
        this.timeline = timeline;
        this.id       = id;         // dancer id
        this.timeInd  = 0;          // dancer timeline index
        this.status   = {};         // dancer current status
        this.posX     = 0;          // dancer position
        this.posY     = 0;          // dancer position
        this.parts    = {};         // dancer body part

        // this.parts["A"]  = new Part();
        // this.parts["B"]  = new Part();
        // this.parts["C"]  = new Part();
        // this.parts["D"]  = new Part();
        // this.parts["E"]  = new Part();
        // this.parts["F"]  = new Part();
        // this.parts["G"]  = new Part();
        this.parts["LEDH"] = new LEDPart(this.id, this.app, loadTexture["LEDH"]);    // LED Head
        // this.parts["LEDH"] = new LEDPart();
        // this.parts["LEDH"] = new LEDPart();
    }

    getIndex(t) {
        // update this by binary search the timeline
        return 0;
    }

    checkUpdate(t) {
        const newTime = t;
        if (newTime >= this.timeline[this.timeInd]["End"]) {
            this.timeInd += 1;
            this.setStat(this.timeline[this.timeInd]["Status"]);
            return true;
        }
        return false;
    }

    setStat(status) {
        this.status = Object.assign({}, status);
    }

    updateTexture() {
        console.log("Update Texture");
        Object.keys(this.parts).map(key => this.parts[key].updateTexture(this.status[key]));
    }

    update (t) {
        if (this.checkUpdate(t)) {
            console.log("Going to update to new status");
            this.updateTexture();
        }
    }
    
    initial (t) {
        this.timeInd = this.getIndex(t);
        this.setStat(this.timeline[this.timeInd]["Status"]);
        this.updateTexture();
        console.log(`Dancer ${this.id} initial status`, this.status);
    }
}

export default Dancer