import { getJson, getLanguage, Canvas, matchAxisTier, orderScores, b64enc } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
const rawScores = params.get("score") ?? "50,50,50,50,50,50";
const scores = rawScores.split(",").map(v => {
    const score = parseFloat(v);
    if (Number.isNaN(score) || !Number.isFinite(score)) {
        return 50;
    }
    return Math.max(Math.min(score, 100), 0);
});
if (scores.length < 6) {
    alert("Invalid result");
    throw new Error("Missing scores");
}
const send = !(params.get("send") === "no");
const canvasElm = document.getElementById("results1");
const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"];
const canvas = new Canvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg);
const version = ui.resultstext.version_name + ": " + window.VERSION;
var today = new Date();
const date = "Taken on: " + today.toISOString().substring(0, 10);
const ideologies = getJson("ideologies-" + lang);
const weights = [1, 0.9, 1, 0.6, 0.6, 0.7];
const matches = orderScores(scores, weights, ideologies);
for (const elm of Object.keys(ui.resultstext.text)) {
    document.getElementById(elm).textContent = ui.resultstext.text[elm];
}
document.title = ui.resultstext.text.title;
const score1 = document.getElementById("score1");
score1.textContent = `${ui.resultstext.closest_match}: ${matches[0].name}`;
const score2 = document.getElementById("score2");
score2.textContent = ui.resultstext.next_matches + ": ";
let nextLabels = Array();
for (let i = 1; i < 5; i++) {
    nextLabels.push(matches[i].name);
}
score2.textContent += nextLabels.join(", ");
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
document.getElementById("lister_button").addEventListener("click", () => window.location.href = "lister.html?lang=" + lang +
    "&score=" + scores.map(x => x.toFixed(1)).join(","));
document.getElementById("questions_button").addEventListener("click", () => window.location.href = "questions.html?lang=" + lang);
document.getElementById("matches_button").addEventListener("click", () => {
    window.location.href = "matches.html?lang=" + lang +
        "&ideo=" + b64enc(matches[0].name);
});
document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
document.getElementById("results1").addEventListener("click", () => Canvas.downloadImage(canvasElm));
let axisLabels = Array();
ui.axes.forEach((v, i) => {
    const tier = matchAxisTier(scores[i], v.tiers);
    let axisLabel;
    if (ui.resultstext.axis_name_before) {
        axisLabel = `${ui.resultstext.axis_name} ${v.axisname}: ${tier}`;
    }
    else {
        axisLabel = `${v.axisname} ${ui.resultstext.axis_name}: ${tier}`;
    }
    axisLabels.push(axisLabel);
});
window.onload = () => {
    canvas.drawHeader(ui.resultstext.text.title, "quark88.github.io/dozenvalues", version, date, matches[0].name);
    ui.axes.forEach((v, i) => {
        const icons = [v.leftvalue.icon, v.rightvalue.icon];
        canvas.drawImages(icons, i);
        const colors = [v.leftvalue.color, v.rightvalue.color];
        canvas.drawBar(i, colors, scores[i], axisLabels[i]);
    });
};
//# sourceMappingURL=results.js.map