import Dancer from "./dancer";
import { DANCER_NUM } from "../constants";

class Simulator {
<<<<<<< HEAD
  constructor(mgr, app, loadTexture) {
    this.app = app;
    this.mgr = mgr;
    // Set dancer
    this.dancers = [];
    for (let i = 0; i < DANCER_NUM; ++i) {
      this.dancers.push(new Dancer(i, this.app, loadTexture));
=======
    constructor(mgr, app, loadTexture) {
        this.app = app;
        this.mgr = mgr;
        // Set dancer
        this.dancers = [];
        for (let i = 0;i < DANCER_NUM; ++i) {
            this.dancers.push(new Dancer(i, this.app, loadTexture));
        }
    }
    updateEdit(checkedDancerId) {
        if (this.mgr.newStatus.length === 0) console.error(`Error: [updateEdit]`);
        const id = checkedDancerId;
        this.dancers[id].update(this.mgr.newStatus[id]);
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
    }
  }
  updateEdit(checkedDancerId) {
    if (this.mgr.newStatus.length === 0) console.error(`Error: [updateEdit]`);
    const id = checkedDancerId;
    this.dancers[id].update(this.mgr.newStatus[id]);
  }

  update(dancerId, timeInd) {
    this.dancers[dancerId].update(
      this.mgr.control[dancerId][timeInd]["Status"]
    );
  }

  updateAll() {
    console.log("updatAll");
    for (let i = 0; i < DANCER_NUM; ++i) {
      this.update(i, this.mgr.timeInd[i]);
    }
  }
}

export default Simulator;
