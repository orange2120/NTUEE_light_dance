import Dancer from './dancer'
import { DANCER_NUM, FPS } from '../constants'

class Simulator {
    constructor(app, control, loadTexture) {
        this.app = app;
        this.control = control;
        // set time and timeline array index
        this.time = 0;
        this.dancers = [];
        for (let i = 0;i < DANCER_NUM; ++i) {
            this.dancers.push(new Dancer(i, control[i], this.app, loadTexture));
        }
    }

    update() {
        this.dancers.map(dancer => dancer.update(this.time));
    }

    setStat(t) {
        this.dancers.map(dancer => dancer.setStat(t)); // set dancers' status
        this.time = t;
    }

    initial(t) {
        this.dancers.map(dancer => dancer.initial(t));
    }

    exec(t) { // execute from time t
        this.initial(t);
        // for testing
        this.interval = setInterval(() => {
            this.time += FPS;
            this.update();
        }, 30);
    }
}

export default Simulator
