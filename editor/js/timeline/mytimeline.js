import   './timeliner.js'

// todo: file format conversion

class Mytimeline {
    constructor(callback_func) {
        this.target = {
            currentTime: 0
        };
    }
    createFromRaw(data,callback_func){
        this.target = {
            dancer_1: 0,
            dancer_2: 0,
            dancer_3: 0,
            dancer_4: 0,
            dancer_5: 0,
            dancer_6: 0,
            dancer_7: 0,
            dancer_8: 0,
            pos_1: 0,
            pos_2: 0,
            pos_3: 0,
            currentTime: 0
        };
        function callBack_updateTime(t)
        {
            // console.log(t);
            // callback_func(_type,param)
            callback_func("time_update",t)
        }
        this.timelineData = JSON.parse(JSON.stringify(data));
        this.timeliner = new Timeliner(this.target,callBack_updateTime);
        this.timeliner.load(this.timelineData)
    }
    createFromData(data_control,data_load,callback_func){
        this.target = {
            currentTime: 0
        };
        let data = this.convertData(data_control,data_load,this.target)
        function callBack_updateTime(t)
        {
            // this.target.currentTime = t
            // console.log("target= ")
            // console.log(this.target)
            // console.log(t);
            // callback_func(_type,param)
            callback_func("time_update",t)
        }
        this.timelineData = JSON.parse(JSON.stringify(data));
        this.timeliner = new Timeliner(this.target,callBack_updateTime);
        this.timeliner.load(this.timelineData)
    }
    reload(data,ui_conserve = true){
        if(ui_conserve){
            let _tmp_ui = this.timelineData.ui
            this.timelineData = JSON.parse(JSON.stringify(data))
            this.timelineData.ui = _tmp_ui
        }else{
            this.timelineData = JSON.parse(JSON.stringify(data))
        }
        
        // this.timeliner.loadJSONString(JSON.stringify(this.timelineData))
        this.timeliner.load(this.timelineData)
    }
    convertData(data_control,data_load,_tar){
        let data_from_load = data_load["timeline_setting"]
        let newa = data_control.map(timeline => { 
            return{ name : "dancer_",tmpValue : 3.500023, _color: "#6ee167",
            _value: 0.9955620977777778 ,values : timeline.map( entry => {
                return {time : entry.Start, value: 0, _color : "#1b3e5c"};
            })
        }; 
        })
        for (let i = 0; i < newa.length; i++) { 
            newa[i].name = 'dancer_' + String(i+1);
            _tar['dancer_' + String(i+1)] = 0;
        }
        data_from_load.layers = newa
        return data_from_load
    }
    gotoTime(t){

    }
    KeyFrame(layer_index,time){
        this.timeliner.addKeyFrame(layer_index,time,0)
    }
    getCurrentTime(){

    }

}

export default Mytimeline







// initialize timeliner
// let timeliner = new Timeliner(target,callBack_updateTime);

// user defined callbackfunction when update time
// function callBack_updateTime(t)
// {
	// console.log(t);
// }

// Timeliner.prototype.testfunc = function(){}

// timeliner.callback_timeUpdate = function(){console.log("dd");}

// timeliner.addLayer('e');
// timeliner.addLayer('y');
// timeliner.addLayer('rotate');

// var o = {"version":"1.2.0","modified":"Mon Dec 08 2014 10:41:11 GMT+0800 (SGT)","title":"Untitled", "layers": [{"name":"x","values":[],"tmpValue":0,"_color":"#10b00d"},{"name":"y","values":[{"time":0,"value":-1.2999770000000004,"_color":"#4a2392","tween":"quadEaseIn"},{"time":3.3,"value":-1.1999850000000003,"_color":"#cddfd8"}],"tmpValue":-1.2999770000000004,"_color":"#344260"},{"name":"rotate","values":[{"time":0,"value":4.200005,"_color":"#ec9bb5","tween":"quadEaseInOut"},{"time":2.1,"value":28.000009,"_color":"#ac8e14","tween":"quadEaseIn"},{"time":5,"value":50.400018,"_color":"#5c659"}],"tmpValue":50.400018,"_color":"#1fa995"}]};
// timeliner.load(o);



// timeliner.load(data_blank);

// alert(json);
// let mydata = JSON.parse(data);

// timeliner.cc(asd);å
// timeliner.load({"version":"1.2.0","modified":"Mon Dec 08 2014 10:41:11 GMT+0800 (SGT)","title":"Untitled","layers":[{"name":"x","values":[{"time":0.1,"value":0,"_color":"#893c0f","tween":"quadEaseIn"},{"time":3,"value":3.500023,"_color":"#b074a0"}],"tmpValue":3.500023,"_color":"#6ee167"},{"name":"y","values":[{"time":0.1,"value":0,"_color":"#abac31","tween":"quadEaseOut"},{"time":0.5,"value":-1.000001,"_color":"#355ce8","tween":"quadEaseIn"},{"time":1.1,"value":0,"_color":"#47e90","tween":"quadEaseOut"},{"time":1.7,"value":-0.5,"_color":"#f76bca","tween":"quadEaseOut"},{"time":2.3,"value":0,"_color":"#d59cfd"}],"tmpValue":-0.5,"_color":"#8bd589"},{"name":"rotate","values":[{"time":0.1,"value":-25.700014000000003,"_color":"#f50ae9","tween":"quadEaseInOut"},{"time":2.8,"value":0,"_color":"#2e3712"}],"tmpValue":-25.700014000000003,"_color":"#2d9f57"}]});

// timeliner.load({"version":"1.3.0","modified":"Tue Dec 16 2014 10:27:28 GMT+0800 (SGT)","title":"Untitled","layers":[{"name":"a","values":[],"_value":0,"_color":"#9ab426"}],"name":"simple"});

// let w2 = window.innerWidth / 2;
// let h2 = window.innerHeight / 2;

// function animate() {
	// requestAnimationFrame(animate);
	// target.currentTime=timeliner._out_data.getValue("ui:currentTime");
	// console.log(target);
	// console.log(timeliner);
	// console.log(timeliner._out_data.getValue("ui:currentTime"));
	// console.log(timeliner.getCurrentTime());
	// box.style.transform = 'translateX(' +  (target.x * 100 + w2) + 'px) translateY(' + (target.y * 100 + h2) + 'px) rotate(' + target.rotate * 50 + 'deg)';

// }

// animate();


