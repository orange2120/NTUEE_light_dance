import { DANCER_NUM, LEDPARTS, LIGHTPARTS } from '../constants';

export function checkControl(control) {
    console.log("Checking Control ...");
    // Check DANCER_NUM == TimeLine Num
    if (control.length != DANCER_NUM) {
        for (let i = control.length; i < DANCER_NUM; ++i) control.push([]);
    }
    // Check Every Status
    control.map(timeLine => {
        if (timeLine.length === 0) timeLine.push({});
        timeLine.map(Status => {
            if (!Status["Start"]) Status["Start"] = 0;
            if (typeof Status["Start"] != Number) Status["Start"] = Number(Status["Start"]);

            if (!Status["Status"]) Status["Status"] = {};
            const status = Status["Status"];
            LIGHTPARTS.map(lightPart => {
                if (!status[lightPart]) status[lightPart] = 0;
                if (typeof status[lightPart] != Number) status[lightPart] = Number(status[lightPart]);
            });
            LEDPARTS.map(ledPart => {
                if (!status[ledPart]) status[ledPart] = {};
                if (!status[ledPart]["name"]) status[ledPart]["name"] = "";
                if (!status[ledPart]["alpha"]) status[ledPart]["alpha"] = 0;
                if (typeof status[ledPart]["alpha"] != Number) status[ledPart]["alpha"] = Number(status[ledPart]["alpha"]);
            });
        });
    });
    console.log("Check Finished", control);
}

export function checkPreset(presets) {
    console.log("Checking Preset ...");

    // Check Every Preset Status
    presets.map(preset => {
        const status = preset["Status"];
        LIGHTPARTS.map(lightPart => {
            if (!status[lightPart]) status[lightPart] = 0;
            if (typeof status[lightPart] != Number) status[lightPart] = Number(status[lightPart]);
        });
        LEDPARTS.map(ledPart => {
            if (!status[ledPart]) status[ledPart] = {};
            if (!status[ledPart]["name"]) status[ledPart]["name"] = "";
            if (!status[ledPart]["alpha"]) status[ledPart]["alpha"] = 0;
            if (typeof status[ledPart]["alpha"] != Number) status[ledPart]["alpha"] = Number(status[ledPart]["alpha"]);
        });
    });
    console.log("Check Finished", presets);
}
