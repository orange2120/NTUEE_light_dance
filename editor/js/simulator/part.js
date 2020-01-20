// Body Part
import * as PIXI from 'pixi.js'


class Part {
    constructor(id, app, textures) {
        this.dancerID = id;
        this.posX = 0;
        this.posY = 0;
        this.paths = textures;
        this.textures = {};
        this.paths.map(path => {
            this.textures[path] = PIXI.Texture.from(`../../asset/LED/${path}.png`)
        });
        this.sprite = new PIXI.Sprite();
        this.sprite.scale.set(40); // to scale up the led texture
        this.sprite.x += this.dancerID * this.sprite.width * 8.5;
        app.stage.addChild(this.sprite);
        console.log(this);
    }
    updateTexture(bright) {
        console.log("Updating bright", bright);
    }
}

class LEDPart extends Part {
    constructor(id, app, textures) {
        super(id, app, textures);
    }
    updateTexture({path, alpha}) {
        console.log("Updating LED: ", path, alpha);
        this.sprite.texture = this.textures[path];
        this.sprite.alpha = alpha;
    }

}

export { Part, LEDPart }