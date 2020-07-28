import Wavesurfer from "wavesurfer.js";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.min";

class MyWaveSurfer {
  constructor(mgr, music) {
    this.mgr = mgr;
    this.ready = false;
    this.wavesurfer = Wavesurfer.create({
      container: "#waveform",
      waveColor: "#5bc1f0",
      progressColor: "#1883b5",
      cursorColor: "#edf0f1",
      height: screen.height * 0.08,
      plugins: [
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          color: "#edf0f1",
          customShowTimeStyle: {
            "background-color": "#000",
            color: "#fff",
            padding: "2px",
            "font-size": "10px",
          },
        }),
        TimelinePlugin.create({
          container: "#wave-timeline",
          unlabeledNotchColor: "white",
          primaryColor: "white",
          secondaryColor: "white",
          primaryFontColor: "white",
          secondaryFontColor: "white",
        }),
      ],
    });
    this.wavesurfer.load(`./music/${music}`);
    this.wavesurfer.on("ready", () => {
      this.ready = true;
    });
    this.wavesurfer.on("audioprocess", () => this.updateAudioProcess());

    // DOM Stuff
    // play/pause
    document.getElementById("playPause-btn").onclick = () => this.playPause();
    // stop
    document.getElementById("stop-btn").onclick = () => {
      this.wavesurfer.stop();
      this.mgr.changeTime(0);
    };
    // zoom slider
    const zoomSlider = document.getElementById("zoom-slider");
    zoomSlider.min = 1;
    zoomSlider.max = 200;
    zoomSlider.value = 0;
    zoomSlider.addEventListener("change", (e) => this.zoom(e.target.value));
    // keyEvent
    this.addKeyEvent();
    // mouseEvent
    this.addClickEvent();
  }

  addKeyEvent() {
    document.addEventListener("keydown", (e) => {
      if (e.target.closest("input, select, button")) return;
      const SPACE = e.keyCode === 32;
      if (SPACE) this.playPause();
    });
  }

  addClickEvent() {
    document.getElementById("waveform").addEventListener("click", (e) => {
      // From CursorPlugin Source Code
      const bbox = this.wavesurfer.container.getBoundingClientRect();
      const xpos = e.clientX - bbox.left;
      const duration = this.wavesurfer.getDuration();
      const elementWidth =
        this.wavesurfer.drawer.width / this.wavesurfer.params.pixelRatio;
      const scrollWidth = this.wavesurfer.drawer.getScrollX();

      const scrollTime =
        (duration / this.wavesurfer.drawer.width) * scrollWidth;

      const timeValue =
        Math.max(0, (xpos / elementWidth) * duration) + scrollTime;
      this.mgr.changeTime(Math.round(timeValue * 1000));
    });
  }

  playPause() {
    if (!this.ready) {
      console.log("Audio is not ready yet!!");
      return;
    }
    this.wavesurfer.playPause();
  }

  updateAudioProcess() {
    // console.log("Audio Process ", this.wavesurfer.getCurrentTime());
    const newTime = this.wavesurfer.getCurrentTime();
    this.mgr.changeTime(Math.round(newTime * 1000), true);
  }

  zoom(val) {
    // console.log("Zooming", Number(val));
    this.wavesurfer.zoom(Number(val));
  }

  update() {
    // sync to mgr
    if (this.wavesurfer.isPlaying()) return;
    const duration = this.wavesurfer.getDuration();
    // console.log("Wavesurfer update", Number.parseFloat(this.mgr.time) / 1000);
    this.wavesurfer.seekTo(Number.parseFloat(this.mgr.time) / 1000 / duration);
  }
}

export default MyWaveSurfer;
