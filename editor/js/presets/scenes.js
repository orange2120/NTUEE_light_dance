import shortid from "shortid";
import { DANCER_NUM } from "../constants";

class Scenes {
  constructor(mgr, scenes) {
    this._mgr = mgr;
    this._scenes = scenes;
    this._el = document.querySelector("#scenes");
    this._tmpScene = null;
    this._addAllElement();
    // add KeyBoard Event
    this._addKeyBoardEvent();
    console.log("Scenes", this);
  }

  // Add DOM Element
  _addAllElement() {
    this._addTitle();
    this._addList();
  }
  _addTitle() {
    const div = document.createElement("div");
    div.classList.add("title");
    const titleText = document.createTextNode("Scenes");
    const addBtn = document.createElement("span");
    addBtn.innerText = "+";
    addBtn.classList.add("scenes-addbtn");
    div.appendChild(titleText);
    div.appendChild(addBtn);
    this._el.appendChild(div);
    // Add click event
    addBtn.onclick = (e) => {
      const msg =
        "Do you want to save this Status to Scene ?\n(If yes, please Enter the name)";
      let newName = prompt(msg);
      if (newName !== null) {
        if (/\S/.test(newName)) {
          let newScene = this._createScene(newName);
          this._addScene(newScene);
        } else {
          console.log("Invalid Name!!!");
        }
      }
    };
  }
  _addList() {
    const scenesListDiv = document.createElement("div");
    scenesListDiv.id = "scenes-list";
    this._el.appendChild(scenesListDiv);
    try {
      this._scenes.map((scene) => {
        this._addScene(scene);
      });
    } catch (e) {
      console.log("this.scenes can't be map!!", this.scenes);
    }
  }
  _addScene(scene) {
    const { name, id, status } = scene;
    const scenesListDiv = document.querySelector("#scenes-list");
    // console.log("Adding Scene", name, id, status);

    const li = document.createElement("div");
    li.classList.add("scenes-li");
    li.id = id;
    li.innerText = name;

    const trashIcon = document.createElement("div");
    trashIcon.innerHTML = '<i class="fas fa-trash"></i>';

    li.appendChild(trashIcon);
    scenesListDiv.appendChild(li);

    // Add click event
    li.ondblclick = (e) => {
      this._mgr.loadScene(scene);
    };
    trashIcon.onclick = (e) => {
      this._delScene(id);
    };
  }

  _addKeyBoardEvent() {
    window.onkeydown = (e) => {
      if (e.ctrlKey) {
        // ctrl + c
        if (e.key === "c" || e.key === "C") {
          // console.log("ctrl + c is pressed!!");
          this._createTempScene();
        }
        // ctrl + v
        else if (e.key === "v" || e.key === "V") {
          // console.log("ctrl + v is pressed!!");
          if (this._tmpScene !== null) this._mgr.loadScene(this._tmpScene);
        }
      }
    };
  }
  // private functions
  _createScene(name) {
    let newScene = {};
    newScene["name"] = name;
    newScene["id"] = shortid.generate();
    newScene["status"] = [];
    for (let i = 0; i < DANCER_NUM; ++i) {
      newScene["status"].push(
        this._mgr.control[i][this._mgr.timeInd[i]]["Status"]
      );
    }
    this._scenes.push(newScene);
    this._saveScenes();
    console.log("_createScene", newScene);
    return newScene;
  }
  _saveScenes() {
    window.localStorage.setItem("scenes", JSON.stringify(this._scenes));
  }
  _delScene(id) {
    this._scenes = this._scenes.filter((scene) => scene.id != id);
    document
      .querySelector("#scenes-list")
      .removeChild(document.getElementById(id));
    this._saveScenes();
  }
  _createTempScene() {
    // fired when ctrl + c
    console.log("_createTempScene", this._tmpScene);
    this._tmpScene = {};
    this._tmpScene["status"] = [];
    for (let i = 0; i < DANCER_NUM; ++i) {
      this._tmpScene["status"].push(
        this._mgr.control[i][this._mgr.timeInd[i]]["Status"]
      );
    }
  }
}

export default Scenes;
