import * as PIXI from 'pixi.js';
import { BlackPart, LightPart, LEDPart } from './part.js';
import { DANCERPOS } from '../constants';

class Dancer {
    constructor(id, timeline, app, loadTexture) {
        console.log(`Construct Dacner ${id} with`, timeline);
        this.app = app;
        this.timeline = timeline;
        this.id       = id;         // dancer id
        this.timeInd  = 0;          // dancer timeline index
        this.status   = {};         // dancer current status
        this.parts    = {};         // dancer body part
        
        // BlackPart
        this.parts["BLHAT"] = new BlackPart(this, "BLHAT", this.app);
        this.parts["BLFACE"] = new BlackPart(this, "BLFACE", this.app);
        this.parts["BLCOAT"] = new BlackPart(this, "BLCOAT", this.app);
        this.parts["BLHAND"] = new BlackPart(this, "BLHAND", this.app);
        this.parts["BLINNER"] = new BlackPart(this, "BLINNER", this.app);
        this.parts["BLPANTS"] = new BlackPart(this, "BLPANTS", this.app);
        this.parts["BLSHOES"] = new BlackPart(this, "BLSHOES", this.app);

        // LightPart
        this.parts["HAT1"] =  new LightPart(this, "HAT1", this.app);
        this.parts["HAT2"] = new LightPart(this, "HAT2", this.app);
        this.parts["FACE1"] = new LightPart(this, "FACE1", this.app);
        this.parts["FACE2"] = new LightPart(this, "FACE2", this.app);
        this.parts["FACE3"] = new LightPart(this, "FACE3", this.app);
        this.parts["HAND"] = new LightPart(this, "HAND", this.app);
        this.parts["PANTS1"] = new LightPart(this, "PANTS1", this.app);
        this.parts["PANTS2"] = new LightPart(this, "PANTS2", this.app);
        this.parts["INNER2"] = new LightPart(this, "INNER2", this.app);
        this.parts["INNER1"] = new LightPart(this, "INNER1", this.app);
        this.parts["COAT1"] = new LightPart(this, "COAT1", this.app);
        this.parts["COAT2"] = new LightPart(this, "COAT2", this.app);
        this.parts["COLLAR"] = new LightPart(this, "COLLAR", this.app);
        this.parts["WRIST"] = new LightPart(this, "WRIST", this.app);
        this.parts["SHOES1"] = new LightPart(this, "SHOES1", this.app);
        this.parts["SHOES2"] = new LightPart(this, "SHOES2", this.app);

        // LEDPART
        // this.parts["LEDH"] = new LEDPart(this, this.app, loadTexture["LEDH"]);    // LED Head

        // PIXI Rendering
        this.container = new PIXI.Container();
        Object.keys(this.parts).map(key => {
            this.container.addChild(this.parts[key].sprite);
        });
        this.container.position.set(DANCERPOS[id].x, DANCERPOS[id].y);
        app.stage.addChild(this.container);
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