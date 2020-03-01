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
            if (typeof Status["Start"] != "number") Status["Start"] = Number(Status["Start"]);

            if (!Status["Status"]) Status["Status"] = {};
            const status = Status["Status"];
            LIGHTPARTS.map(lightPart => {
                if (!status[lightPart]) status[lightPart] = 0;
                if (typeof status[lightPart] != "number") status[lightPart] = Number(status[lightPart]);
            });
            LEDPARTS.map(ledPart => {
                if (!status[ledPart]) status[ledPart] = {};
                if (!status[ledPart]["name"]) status[ledPart]["name"] = "";
                if (!status[ledPart]["alpha"]) status[ledPart]["alpha"] = 0;
                if (typeof status[ledPart]["alpha"] != "number") status[ledPart]["alpha"] = Number(status[ledPart]["alpha"]);
            });
        });
    });
    console.log("Check Finished", control);
}

export function checkPreset(presets) {
    console.log("Checking Preset ...", JSON.parse(JSON.stringify(presets)));

    // Check Every Preset Status
    presets.map(preset => {
        const status = preset["Status"];
        LIGHTPARTS.map(lightPart => {
            if (!status[lightPart]) status[lightPart] = {};
            let oldVal = 0;
            if (typeof status[lightPart] === "number") {
                oldVal = status[lightPart];
                status[lightPart] = {};
            }
            if (typeof status[lightPart]["checked"] === "undefined") status[lightPart]["checked"] = true;
            status[lightPart]["checked"] = Boolean(status[lightPart]["checked"]);
            if (!status[lightPart]["value"]) status[lightPart]["value"] = oldVal;
            // if (typeof status[lightPart]["value"] != Number) status[lightPart]["value"] = status[lightPart]["value"]["value"]
        });
        LEDPARTS.map(ledPart => {
            if (!status[ledPart]) status[ledPart] = {};
            if (!status[ledPart]["name"]) status[ledPart]["name"] = "";
            if (!status[ledPart]["alpha"]) status[ledPart]["alpha"] = 0;
            if (typeof status[ledPart]["checked"] === "undefined") status[ledPart]["checked"] = true;
            status[ledPart]["checked"] = Boolean( status[ledPart]["checked"]);
            if (typeof status[ledPart]["alpha"] != "number") status[ledPart]["alpha"] = Number(status[ledPart]["alpha"]);
        });
    });
    console.log("Check Finished", presets);
}
