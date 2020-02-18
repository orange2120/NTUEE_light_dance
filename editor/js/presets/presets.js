class Presets {
    constructor(mgr, load = []) {
        this.mgr = mgr;
        this.presets = load;
        // DOM Stuff
        this.el = document.getElementById('presets');
        this.presets.map(preset => this.addPreset(preset));
    }
    addPreset(preset) {
        const name = preset["Name"];
        const status = preset["Status"];
        // const dancers = preset["dancers"];
        console.log(name, status)
        // DOM stuff
        const li = document.createElement("div");
        li.classList.add("preset-li");
        li.id = name;
        li.innerText = name;
        document.getElementById("presets-list").appendChild(li);
    }
    createPreset() {

    }


}

export default Presets