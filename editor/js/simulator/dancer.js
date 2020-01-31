import * as PIXI from 'pixi.js';
import { BlackPart, LightPart, LEDPart } from './part.js';
import { BLPARTS, LIGHTPARTS, DANCERPOS } from '../constants';

class Dancer {
    constructor(id, timeline, app, loadTexture) {
        this.app = app;
        this.timeline = timeline;
        this.id       = id;         // dancer id
        this.timeInd  = 0;          // dancer timeline index
        this.status   = {};         // dancer current status
        this.parts    = {};         // dancer body part
        
        // BlackPart
        BLPARTS.map(blpart => this.parts[blpart] = new BlackPart(this, blpart, this.app));
        // LightPart
        LIGHTPARTS.map(lipart => this.parts[lipart] = new LightPart(this, lipart, this.app));
        // LEDPART
        // this.parts["LEDH"] = new LEDPart(this, this.app, loadTexture["LEDH"]);    // LED Head

        // PIXI Rendering
        this.container = new PIXI.Container();
        Object.keys(this.parts).map(key => {
            this.container.addChild(this.parts[key].sprite);
        });
        this.container.position.set(DANCERPOS[id].x, DANCERPOS[id].y);
        this.container.sortableChildren = true;
        app.stage.addChild(this.container);

        console.log("Dancer Constructed", this);
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
            // console.log("Going to update to new status");
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