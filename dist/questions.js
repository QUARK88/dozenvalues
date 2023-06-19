import { getJson, getLanguage } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
for (const [key, value] of Object.entries(ui.questionstext)) {
    document.getElementById(key).textContent = value;
}
document.getElementById("lister_button").addEventListener("click", () => window.location.href = "lister.html?lang=" + lang);
document.getElementById("matches_button").addEventListener("click", () => {
    window.location.href = "matches.html?lang=" + lang;
});
document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
const questions = getJson("questions-" + lang);
const questionHolder = document.getElementById("questionholder");
const elmMaker = (eff, val) => {
    const mainElm = document.createElement("div");
    mainElm.className = "value-holder";
    const imgElm = new Image();
    imgElm.src = val.icon;
    const scoreElm = document.createElement("div");
    scoreElm.style.backgroundColor = val.color;
    mainElm.appendChild(imgElm);
    return mainElm;
};
var number = 0;
for (const question of questions) {
    number += 1;
    const parentElm = document.createElement("div");
    parentElm.className = "question-holder";
    const questionText = document.createElement("div");
    questionText.className = "question-text";
    questionText.textContent = number + ". " + question.text;
    parentElm.appendChild(questionText);
    question.effect.forEach((eff, ind) => {
        if (eff > 0) {
            parentElm.appendChild(elmMaker(eff, ui.axes[ind].leftvalue));
            if (eff > 1) {
                parentElm.appendChild(elmMaker(eff, ui.axes[ind].leftvalue));
            }
        }
        else if (eff < 0) {
            parentElm.appendChild(elmMaker(Math.abs(eff), ui.axes[ind].rightvalue));
            if (eff < -1) {
                parentElm.appendChild(elmMaker(Math.abs(eff), ui.axes[ind].rightvalue));
            }
        }
    });
    questionHolder.appendChild(parentElm);
}
//# sourceMappingURL=questions.js.map