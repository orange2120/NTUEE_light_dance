import PIXI from 'pixi.js'
import Part from 'part.js'

class Dancer {
    constructor() {
        this.id = 0;
        this.posX = 0;
        this.posY = 0;
        this.parts = []
    }
    update (status) {
        console.log(`Dancer ${this.id} get Status`, status);

    }
    
    initial () {

    }

}

export default Dancer