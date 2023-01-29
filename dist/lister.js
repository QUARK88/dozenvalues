import { getJson, getLanguage, orderScores, b64enc } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
const rawScores = params.get("score") ?? "50,50,50,50,50,50";
let scores = rawScores.split(",").map(v => parseFloat(v));
const ideologies = getJson("ideologies-" + lang);
const weights = [1, 0.9, 1, 0.6, 0.6, 0.7];
if (scores.length != 6 || !scores.every(x => x >= 0 && x <= 100)) {
    scores = new Array(6).fill(50);
}
const matches = orderScores(scores, weights, ideologies);
for (const [key, value] of Object.entries(ui.listertext)) {
    document.getElementById(key).textContent = value;
}
document.getElementById("questions_button").addEventListener("click", () => window.location.href = "questions.html?lang=" + lang);
document.getElementById("matches_button").addEventListener("click", () => {
    window.location.href = "matches.html?lang=" + lang +
        "&ideo=" + b64enc(matches[0].name);
});
document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
const abscheck = document.getElementById("abs");
abscheck.addEventListener("click", () => displayMatches(matches, abscheck.checked));
displayMatches(matches, abscheck.checked);
function displayMatches(matches, absolute = false) {
    const maximum = scores.map(x => Math.max(x, 100 - x));
    let max = 0;
    for (let i = 0; i < maximum.length; i++) {
        max += weights[i] * Math.pow(maximum[i] / 100, 3);
    }
    max /= maximum.length;
    const maxValue = Math.max(...matches.map(x => x.score));
    const weighedMatches = matches.map(x => {
        const weighedScore = x.score / (absolute ? maxValue : max);
        const obj = {};
        obj.score = 100 * (1 - weighedScore);
        obj.name = x.name;
        return obj;
    });
    const matchholder = document.getElementById("matchholder");
    matchholder.innerHTML = "";
    weighedMatches.forEach((v, i) => {
        const elm = document.createElement("a");
        elm.className = "match-button";
        elm.textContent = `${i + 1}: ${v.name} ${v.score?.toFixed(1)}%`;
        elm.href = `matches.html?lang=${lang}&ideo=${b64enc(v.name)}`;
        matchholder.appendChild(elm);
    });
}
//# sourceMappingURL=lister.js.map