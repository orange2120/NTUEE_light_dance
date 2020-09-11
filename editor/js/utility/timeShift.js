// [ Usage ] node timeShift.js <path to control.json> <shift time(ms, number)>
<<<<<<< HEAD
const fs = require("fs");

const args = process.argv.slice(2);
const filePath = args[0],
  timeShift = Number(args[1]);
console.log("Reading json from ... ", filePath);
console.log("Timesfhit", timeShift.toString());
const raw = fs.readFileSync(filePath);
const control = JSON.parse(raw);
=======
const fs = require('fs');

const args = process.argv.slice(2);
const filePath = args[0], timeShift = Number(args[1]);
console.log("Reading json from ... ", filePath);
console.log("Timesfhit", timeShift.toString())
const raw = fs.readFileSync(filePath);
const control = JSON.parse(raw)
>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
console.log("Original control:\n", control);

let re = [];
for (let id = 0; id < control.length; ++id) {
<<<<<<< HEAD
  re.push([]);
  const timeline = control[id];
  const newTimeline = re[id];
  timeline.map((cue) => {
    const newCue = JSON.parse(JSON.stringify(cue));
    newCue["Start"] = cue["Start"] + timeShift;
    newTimeline.push(newCue);
  });
}
console.log("New control:\n", re);
fs.writeFile(
  filePath.slice(0, -5) + "_timeShift_" + timeShift.toString() + ".json",
  JSON.stringify(re),
  () => {
    console.log(
      "Writing new file to ...",
      filePath.slice(0, -5) + "_timeShift_" + timeShift.toString() + ".json"
    );
  }
);
=======
    re.push([]);
    const timeline = control[id];
    const newTimeline = re[id];
    timeline.map(cue => {
        const newCue = JSON.parse(JSON.stringify(cue));
        newCue["Start"] = cue["Start"] + timeShift;
        newTimeline.push(newCue);
    });
}
console.log("New control:\n", re);
fs.writeFile(filePath.slice(0, -5) + '_timeShift_' + timeShift.toString() + '.json', JSON.stringify(re), () => {
    console.log("Writing new file to ...", filePath.slice(0, -5) + '_timeShift_' + timeShift.toString() + '.json');
});

>>>>>>> 230d97cb7ce450a186f13542c264e7b8cecbaac0
