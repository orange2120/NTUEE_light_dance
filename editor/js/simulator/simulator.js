import Dancer from './dancer'
import { DANCER_NUM, FPS } from '../constants'

class Simulator {
    constructor(app, control, loadTexture) {
        this.app = app;
        this.control = control;
        // Set dancer
        this.dancers = [];
        for (let i = 0;i < DANCER_NUM; ++i) {
            this.dancers.push(new Dancer(i, control[i], this.app, loadTexture));
        }
    }

    update(dancerId, timeInd) {
        this.dancers[dancerId].update(timeInd);
        // this.dancers.map(dancer => dancer.update(timeInd));
    }
}

export default Simulator
