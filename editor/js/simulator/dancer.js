import * as PIXI from 'pixi.js';
import { BlackPart, LightPart, LEDPart } from './part.js';
import { BLPARTS, LIGHTPARTS, DANCERPOS, DISPLAY_HEIGHT, DISPLAY_WIDTH, DANCER_NUM } from '../constants';

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
        // Calculate position and scale
        const ratio = this.container.width / this.container.height;
        this.container.height = (DISPLAY_HEIGHT * 0.95) / 2;
        this.container.width = this.container.height * ratio;
        this.container.sortableChildren = true;

        const half = DANCER_NUM / 2;
        const wOffset = (DISPLAY_WIDTH - half * this.container.width) / (half + 1);
        const y = (id >= half ? DISPLAY_HEIGHT / 2 : 0);
        let _id = id % 4;
        const x = (_id + 1) * wOffset + _id * this.container.width;
        this.container.position.set(x, y);
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