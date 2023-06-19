import { getJson, getLanguage } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
const random = params.get("rand") === "true";
const questions = getJson("questions-" + lang);
for (const elm of Object.keys(ui.quiztext.text)) {
    document.getElementById(elm).textContent = ui.quiztext.text[elm];
}
document.title = ui.quiztext.text.title;
const questiontext = document.getElementById("questiontext");
const questionnumber = document.getElementById("question_number");
const hbuttonHolder = document.getElementById("hbuttonholder");
const vbuttonHolder = document.getElementById("vbuttonholder");
var hbuttons = 0;
for (const [index, button] of ui.quiztext.hbuttons.entries()) {
    hbuttons += 1;
    const quizbutton = document.createElement("button");
    const quizbuttonspan = document.createElement("span");
    const quizdisagree = document.createElement("div");
    const quizagree = document.createElement("div");
    quizdisagree.className = "disagree";
    quizagree.className = "agree";
    quizdisagree.textContent = ui.quiztext.disagree;
    quizagree.textContent = ui.quiztext.agree;
    quizbuttonspan.textContent = button.text;
    quizbutton.appendChild(quizbuttonspan);
    quizbutton.style.backgroundColor = button.color;
    if (hbuttons == 1) {
        hbuttonHolder.appendChild(quizdisagree);
    }
    if (hbuttons < 3) {
        quizbutton.className = "leftbutton";
    }
    if (hbuttons == 3) {
        quizbutton.className = "centrebutton";
    }
    if (hbuttons > 3) {
        quizbutton.className = "rightbutton";
    }
    quizbutton.addEventListener("click", () => nextQuestion(index));
    hbuttonHolder.appendChild(quizbutton);
    if (hbuttons == 5) {
        hbuttonHolder.appendChild(quizagree);
    }
}
for (const [index, button] of ui.quiztext.vbuttons.entries()) {
    const quizbutton = document.createElement("button");
    const quizbuttonspan = document.createElement("span");
    quizbuttonspan.textContent = button.text;
    quizbutton.appendChild(quizbuttonspan);
    quizbutton.style.backgroundColor = button.color;
    quizbutton.className = "vbutton";
    quizbutton.addEventListener("click", () => nextQuestion(index));
    vbuttonHolder.appendChild(quizbutton);
}
const hbuttonholder = document.getElementById("hbuttonholder");
const vbuttonholder = document.getElementById("vbuttonholder");
const buttonswitch = document.getElementById("buttonswitch");
buttonswitch.addEventListener("click", () => switchOrientation());
function switchOrientation() {
    if (orientation == "v") {
        orientation = "h";
        hbuttonHolder.style.display = "block";
        hbuttonHolder.style.display = "none";
    }
    else {
        orientation = "v";
        hbuttonHolder.style.display = "none";
        hbuttonHolder.style.display = "block";
    }
}
if (window.innerWidth < 1000) {
    var orientation = "v";
}
else {
    var orientation = "h";
}
switchOrientation();
document.getElementById("back_button").addEventListener("click", lastQuestion);
const answers = new Array(questions.length);
const maxvalues = new Array(questions[0].effect.length).fill(0);
for (const question of questions) {
    question.effect.forEach((element, i) => maxvalues[i] += Math.abs(element));
}
if (random) {
    questions.forEach((v, i) => v.ogIndex = i);
    questions.sort(() => 0.5 - Math.random());
}
let curr = 0;
loadQuestion();
function nextQuestion(ansIndex) {
    answers[curr] = ansIndex;
    curr++;
    if (questions[curr])
        loadQuestion();
    else
        calcScores();
}
function loadQuestion() {
    questiontext.textContent = questions[curr].text;
    questionnumber.textContent = `${ui.quiztext.question} ${(curr + 1)} ${ui.quiztext.of} ${questions.length}`;
}
function lastQuestion() {
    curr--;
    if (questions[curr])
        loadQuestion();
    else
        window.history.back();
}
function calcScores() {
    const score = new Array(questions[0].effect.length).fill(0);
    const weighedScore = new Array(questions[0].effect.length).fill(0);
    const weights = [-1, -0.5, 0, 0.5, 1];
    let sortedAnswers = new Array(answers.length);
    if (questions[0]?.ogIndex !== undefined) {
        questions.forEach((v, i) => sortedAnswers[v.ogIndex] = answers[i]);
    }
    answers.forEach((value, index) => questions[index].effect.forEach((v, i) => score[i] += weights[value] * v));
    maxvalues.forEach((v, i) => weighedScore[i] = Math.round((v + score[i]) / (2 * v) * 1000) / 10);
    window.location.href = "results.html?lang=" + lang + "&score=" +
        weighedScore.map(x => x.toFixed(1)).join(",");
}
//# sourceMappingURL=quiz.js.map