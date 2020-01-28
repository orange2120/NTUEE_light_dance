import PIXI from 'pixi.js'
import { BlackPart, LightPart, LEDPart } from './part.js'

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
        
        // BlackPart
        this.parts["BLHAT"] = new BlackPart(this, "BLHAT", this.app);
        this.parts["BLFACE"] = new BlackPart(this, "BLFACE", this.app);
        this.parts["BLCOAT"] = new BlackPart(this, "BLCOAT", this.app);
        this.parts["BLHAND"] = new BlackPart(this, "BLHAND", this.app);
        this.parts["BLINNER"] = new BlackPart(this, "BLINNER", this.app);
        this.parts["BLPANTS"] = new BlackPart(this, "BLPANTS", this.app);
        this.parts["BLSHOES"] = new BlackPart(this, "BLSHOES", this.app);

        // this.parts["A"]  = new Part();
        // this.parts["B"]  = new Part();
        // this.parts["C"]  = new Part();
        // this.parts["D"]  = new Part();
        // this.parts["E"]  = new Part();
        // this.parts["F"]  = new Part();
        // this.parts["HAT"]  = new LightPart(this, this.app, loadTexture["HAT"]);
        // this.parts["LEDH"] = new LEDPart(this, this.app, loadTexture["LEDH"]);    // LED Head
        // this.parts["LEDH"] = new LEDPart();
        // this.parts["LEDH"] = new LEDPart();
    }

    getIndex(t) {
        // update this by binary search the timeline
        return 0;
    }

    checkUpdate(t) {
        const newTime = t;
        if (!this.timeline[this.timeInd + 1]) {
            // TODO: clear interval
            return false;
        }
        if (newTime >= this.timeline[this.timeInd + 1]["Start"]) {
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