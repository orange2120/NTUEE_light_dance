import * as PIXI from 'pixi.js'

class Simulator {
    constructor(app, control, LEDs) {
        this.app = app
        this.control = control
        this.LEDTextures = {}
        LEDs.map(led => this.LEDTextures[led] = PIXI.Texture.from(`../../asset/LED/${led}.png`))
        this.LEDH = new PIXI.Sprite();
        // set time and timeline array index
        this.time = 0
        this.index = 0
    }
    getIndex(t) { // given time
        // update this.time and this.index (binary search)
        return 0
    }
    checkUpdate() {
        this.time += 30
        const time_line = this.control["1"]["time_line"]
        if (this.time >= time_line[this.index]["End"]) {
            this.index += 1
            if (this.index >= time_line.length) {
                clearInterval(this.interval)
            }
            this.status = Object.assign({}, time_line[this.index]["Status"])
            this.update()
        }
    }
    update() { // update by status
        this.LEDH.texture = this.LEDTextures[this.status["LEDH"]["path"]]
        this.LEDH.alpha = this.status["LEDH"]["alpha"]
    }
    exec(t) { // execute from time t
        this.time = t
        this.index = this.getIndex(t)
        this.status = this.control["1"]["time_line"][this.index]["Status"]
        this.update()

        // for testing
        this.LEDH.scale.set(40, 40)
        this.app.stage.addChild(this.LEDH)
        this.interval = setInterval(() => this.checkUpdate(), 30)
    }
}

export default Simulator
