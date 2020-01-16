import * as PIXI from 'pixi.js'
import { DANCER_NUM, DISPLAY_WIDTH, DISPLAY_HEIGHT } from '../constants'

class Simulator {
    constructor(app, control, LEDs) {
        this.app = app
        this.control = control
        this.LEDTextures = {}
        LEDs.map(led => this.LEDTextures[led] = PIXI.Texture.from(`../../asset/LED/${led}.png`))
        // set time and timeline array index
        this.time = 0
        this.index = [] // time line index for every dancer
        this.status = [] // status for every dancer
        this.dancers = []
    }
    getIndex(t) { // given time
        // update this.time and this.index (binary search)
        // for now three dancer from index 0
        return [0, 0, 0]
    }
    checkUpdate() {
        this.time += 30
        this.control.map((time_line, i) => {
            const ind = this.index[i] // time line index of this dancer
            if (this.index[i] >= time_line.length) return
            if (this.time >= time_line[ind]["End"]) {
                this.index[i] += 1
                this.status[i] = Object.assign({}, time_line[this.index[i]]["Status"])
            }
        })
        this.update()
    }
    update() { // update by status
        this.status.map((status, i) => {
            const path = status["LEDH"]["path"]
            this.dancers[i].texture = this.LEDTextures[path]
            this.dancers[i].alpha = status["LEDH"]["alpha"]
        })
    }
    initial(t) {
        this.status = []
        this.time = t
        this.index = this.getIndex(t)
        this.control.map((time_line, i) => {
            const tindex = this.index[i] // time_line index
            this.status.push(time_line[tindex]["Status"])
        })
        console.log(this.status)

        // just for testing LED
        this.status.map(status => {
            const path = status["LEDH"]["path"]
            this.dancers.push(new PIXI.Sprite(this.LEDTextures[path]))
        })
        this.dancers.map((dancer, i) => {
            dancer.scale.set(40)
            console.log(dancer.texture)
            dancer.x += i * dancer.width * 8.5 //
            this.app.stage.addChild(dancer)
        })
    }

    exec(t) { // execute from time t
        this.initial(t);
        this.update()

        // for testing
        this.interval = setInterval(() => this.checkUpdate(), 30)
    }
}

export default Simulator
