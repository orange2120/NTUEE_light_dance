// Body Part
import * as PIXI from "pixi.js";
import { PARTARGS } from "../constants";

class Part {
  constructor(dancer, name, textures) {
    this.dancer = dancer;
    this.dancerID = dancer.id;
    this.name = name;
    this.paths = textures;
    this.textures = {};
    this.sprite = new PIXI.Sprite();
    this.sprite.width = PARTARGS[name].width;
    this.sprite.height = PARTARGS[name].height;
    this.sprite.position.set(PARTARGS[name].x, PARTARGS[name].y);
    this.sprite.zIndex = PARTARGS[name].zIndex;
    // console.log(this);
  }
}

class BlackPart extends Part {
  constructor(dancer, name) {
    super(dancer, name, [name]);
    this.textures[this.paths[0]] = PIXI.Texture.from(
      `./asset/BlackPart/${this.paths[0]}.svg`
    );
    this.sprite.texture = this.textures[this.paths[0]];
  }

  updateTexture(args) {
    // console.log("Error: Black Part shouldn't be updateTexture!!!", args);
  }
}

class LightPart extends Part {
  constructor(dancer, name) {
    super(dancer, name, [name]);
    this.textures[this.paths[0]] = PIXI.Texture.from(
      `./asset/Part/${this.paths[0]}.svg`
    );
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.on("click", () => {
      const checkBox = document.querySelector("#dancer-checkbox-list").children[
        dancer.id
      ].children[0];
      checkBox.onclick();
      checkBox.checked = true;
    });
  }
  updateTexture(alpha) {
    // console.log("Updating bright", alpha);
    this.sprite.texture = this.textures[this.paths[0]];
    this.sprite.alpha = alpha;
  }
}

class LEDPart extends Part {
  constructor(dancer, name, textures) {
    super(dancer, name, textures);
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.paths[name].map((path) => {
      try {
        this.textures[path] = PIXI.Texture.from(
          `../../asset/LED/${name}/${path}.png`
        );
      } catch (err) {
        console.error(err);
      }
    });
    this.sprite.on("click", () => {
      const checkBox = document.querySelector("#dancer-checkbox-list").children[
        dancer.id
      ].children[0];
      checkBox.onclick();
      checkBox.checked = true;
    });
  }
  updateTexture({ name, alpha }) {
    // console.log("Updating LEDPart", name, alpha)
    this.sprite.texture = this.textures[name];
    this.sprite.alpha = alpha;
  }
}

export { Part, BlackPart, LightPart, LEDPart };
