// [ Usage ] node mirror.js <path to control.json> [start time] [end time]
const fs = require("fs");

const leftSide = [
  "L_COAT1",
  "L_COAT2",
  "L_ARM1",
  "L_ARM2",
  "L_PANTS1",
  "L_PANTS2",
  "L_HAND",
  "L_SHOES1",
  "LED_L_SHOE",
];
const rightSide = [
  "R_COAT1",
  "R_COAT2",
  "R_ARM1",
  "R_ARM2",
  "R_PANTS1",
  "R_PANTS2",
  "R_HAND",
  "R_SHOES1",
  "LED_R_SHOE",
];

const args = process.argv.slice(2);
const filePath = args[0];
const startTime = args[1] ? Number(args[1]) : 0;
const endTime = args[2] ? Number(args[2]) : Number.MAX_SAFE_INTEGER;
console.log(`Mirroring from time: ${startTime} to time: ${endTime}`);

console.log("Reading json from ... ", filePath);
const raw = fs.readFileSync(filePath);
const control = JSON.parse(raw);
// console.log("Original control:\n", control);
const re = [];
for (let id = 0; id < control.length; ++id) {
  re.push([]);
  const timeline = control[id];
  const newTimeline = re[id];
  timeline.map((cue) => {
    const newCue = JSON.parse(JSON.stringify(cue));
    if (newCue["Start"] >= startTime && newCue["Start"] <= endTime) {
      // mirroring
      leftSide.map((left, ind) => {
        const right = rightSide[ind];
        newCue["Status"][left] = cue["Status"][right];
        newCue["Status"][right] = cue["Status"][left];
      });
    }
    newTimeline.push(newCue);
  });
}
// console.log("New control:\n", re);
fs.writeFile(filePath.slice(0, -5) + "_mirror.json", JSON.stringify(re), () => {
  console.log(
    "Writing new file to ...",
    filePath.slice(0, -5) + "_mirror.json"
  );
});
