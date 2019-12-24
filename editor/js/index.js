import * as PIXI from 'pixi.js'
import '../css/index.css'

const app = new PIXI.Application({
    width: 800,
    height: 500
})

document.body.appendChild(app.view)

const LEDTexture = PIXI.Texture.from('../../test/LED/inputLEDPNG/test3.png')
const LEDSprite = new PIXI.Sprite(LEDTexture)
LEDSprite.scale.set(40, 40)
app.stage.addChild(LEDSprite)