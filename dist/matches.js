import { getJson, getLanguage, Canvas, matchAxisTier, b64dec } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
const version = ui.resultstext.version_name + ": " + window.VERSION;
var today = new Date();
const date = "Viewed on: " + today.toISOString().substring(0, 10);
const matches = getJson("ideologies-" + lang);
const canvasElm = document.getElementById("match");
const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const [bg, fg] = dark ? ["#202020ff", "#ffffffff"] : ["#e0e0e0ff", "#000000ff"];
const canvas = new Canvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg);
const dropDown = document.getElementById("match-dropdown");
const matchText = document.getElementById("match-text");
var selected = 0;
var swapped = true;
matches.forEach((match, ind) => {
    const opt = document.createElement("option");
    opt.value = ind.toFixed();
    opt.textContent = match.name;
    dropDown.appendChild(opt);
});
ui.axes.forEach((axis, ind) => {
    const images = [axis.leftvalue.icon, axis.rightvalue.icon];
    canvas.drawImages(images, ind);
});
for (const [key, value] of Object.entries(ui.matchestext)) {
    document.getElementById(key).textContent = value;
}
document.getElementById("lister_button").addEventListener("click", () => {
    const index = parseInt(dropDown.value);
    window.location.href = "lister.html?lang=" + lang +
        "&score=" + matches[index].stats.map(x => x.toFixed(1)).join(",");
});
document.getElementById("questions_button").addEventListener("click", () => window.location.href = "questions.html?lang=" + lang);
document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
document.getElementById("swapleft").addEventListener("click", () => {
    if (selected > 0) {
        selected -= 1;
        swapped = true;
        changedSelection(matches[selected]);
    }
});
document.getElementById("swapright").addEventListener("click", () => {
    if (selected < matches.length - 1) {
        selected += 1;
        swapped = true;
        changedSelection(matches[selected]);
    }
});
function changedSelection(match) {
    canvas.drawHeader(ui.resultstext.text.title, "quark88.github.io/dozenvalues", version, date, match.name);
    match.stats.forEach((stat, ind) => {
        const colors = [ui.axes[ind].leftvalue.color, ui.axes[ind].rightvalue.color];
        const tier = matchAxisTier(stat, ui.axes[ind].tiers);
        let axisLabel;
        if (ui.resultstext.axis_name_before) {
            axisLabel = `${ui.resultstext.axis_name} ${ui.axes[ind].axisname}: ${tier}`;
        }
        else {
            axisLabel = `${ui.axes[ind].axisname} ${ui.resultstext.axis_name}: ${tier}`;
        }
        canvas.drawBar(ind, colors, stat, axisLabel);
    });
    matchText.textContent = match.desc;
    if (swapped == false) {
        selected = dropDown.selectedIndex;
    }
    else {
        dropDown.selectedIndex = selected;
    }
    swapped = false;
}
window.onload = () => {
    const ideo = params.get("ideo");
    if (ideo) {
        try {
            const decIdeo = b64dec(ideo);
            const matched = matches.find(x => x.name === decIdeo) ?? matches[selected];
            for (let x = 0; x < matches.length; x++) {
                if (matches[x].name == matched.name) {
                    break;
                }
                ;
                selected = x + 1;
            }
            changedSelection(matched);
            dropDown.selectedIndex = matches.indexOf(matched);
        }
        catch (e) {
            console.error(e);
            changedSelection(matches[selected]);
        }
    }
    else {
        changedSelection(matches[selected]);
    }
};
dropDown.addEventListener("change", () => {
    const index = parseInt(dropDown.value);
    changedSelection(matches[index]);
});
//# sourceMappingURL=matches.js.map