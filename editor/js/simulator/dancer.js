import * as PIXI from 'pixi.js';
import { BlackPart, LightPart, LEDPart } from './part.js';
import { BLPARTS, LIGHTPARTS, DANCERPOS } from '../constants';

class Dancer {
    constructor(id, app, loadTexture) {
        this.app = app;
        this.id       = id;         // dancer id
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

    setStat(status) {
        this.status = Object.assign({}, status);
    }

    updateTexture() {
        // console.log("Update Texture");
        Object.keys(this.parts).map(key => this.parts[key].updateTexture(this.status[key]));
    }

    update (status) {
        this.setStat(status);
        this.updateTexture();
    }
}

export default Dancer