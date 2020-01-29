// Body Part
import * as PIXI from 'pixi.js';
import { PARTARGS } from '../constants';

class Part {
    constructor(dancer, name, app, textures) {
        this.dancer = dancer;
        this.dancerID = dancer.id;
        this.name = name;
        this.paths = textures;
        this.textures = {};
        this.sprite = new PIXI.Sprite();
        this.sprite.width = PARTARGS[name].width;
        this.sprite.height = PARTARGS[name].height;
        this.sprite.position.set(PARTARGS[name].x, PARTARGS[name].y);
        // app.stage.addChild(this.sprite);
        console.log(this);
    }
}

class BlackPart extends Part {
    constructor(dancer, name, app) {
        super(dancer, name, app, [name]);
        this.textures[this.paths[0]] = PIXI.Texture.from(`../../asset/BlackPart/${this.paths[0]}.svg`);
        this.sprite.texture = this.textures[this.paths[0]];
    }

    updateTexture(args) {
        console.log("Error: Black Part shouldn't be updateTexture!!!", args);
    }
}



class LightPart extends Part {
    constructor(dancer, name, app) {
        super(dancer, name, app, [name]);
        this.textures[this.paths[0]] = PIXI.Texture.from(`../../asset/Part/${this.paths[0]}.svg`)
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.on('click', () => {
            console.log("This is clicked!!", this);
        });
    }
    updateTexture(bright) {
        console.log("Updating bright", bright);
        this.sprite.texture = this.textures[this.paths[0]];
        this.sprite.alpha = bright;
    }
}

class LEDPart extends Part {
    constructor(dancer, name, app, textures) {
        super(dancer, name, app, textures);
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.paths.map(path => {
            this.textures[path] = PIXI.Texture.from(`../../asset/LED/${path}.png`)
        });
        this.sprite.scale.set(40); // to scale up the led texture
        this.sprite.x += this.dancerID * this.sprite.width * 8.5;
    }
    updateTexture({path, alpha}) {
        console.log("Updating LED: ", path, alpha);
        this.sprite.texture = this.textures[path];
        this.sprite.alpha = alpha;
    }

}

export { Part, BlackPart, LightPart, LEDPart }