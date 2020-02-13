import Wavesurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';

console.log(Wavesurfer)
class MyWaveSurfer {
    constructor(mgr, music) {
        this.mgr = mgr;
        this.ready = false;
        this.wavesurfer = Wavesurfer.create({
            container: "#waveform",
            waveColor: '#5bc1f0',
            progressColor: '#1883b5',
            plugins: [
                CursorPlugin.create({
                    showTime: true,
                    opacity: 1,
                    customShowTimeStyle: {
                        'background-color': '#000',
                        color: '#fff',
                        padding: '2px',
                        'font-size': '10px'
                    }
                }),
                TimelinePlugin.create({
                    container: "#wave-timeline"
                })
            ]
        });
        this.wavesurfer.load(music);
        this.wavesurfer.on('ready', () => {
            this.ready = true;
        });

        // DOM Stuff
        document.getElementById("playPause-btn").onclick = () => this.playPause();
        console.log(this);
    }
    playPause() {
        if (!this.ready) {
            console.log("Audio is not ready yet!!");
            return;
        }
        this.wavesurfer.playPause();
    }
}

export default MyWaveSurfer;