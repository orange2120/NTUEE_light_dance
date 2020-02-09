import Dancer from './dancer'
import { DANCER_NUM, FPS } from '../constants'

class Simulator {
    constructor(mgr, app, loadTexture) {
        this.app = app;
        this.mgr = mgr;
        // Set dancer
        this.dancers = [];
        for (let i = 0;i < DANCER_NUM; ++i) {
            this.dancers.push(new Dancer(i, this.app, loadTexture));
        }
    }

    update(dancerId, timeInd) {
        this.dancers[dancerId].update(this.mgr.control[dancerId][timeInd]["Status"]);
    }
}

export default Simulator
