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
const buttonHolder = document.getElementById("buttonholder");
const questiontext = document.getElementById("questiontext");
const questionnumber = document.getElementById("question_number");
for (const [index, button] of ui.quiztext.buttons.entries()) {
    const quizbutton = document.createElement("button");
    quizbutton.textContent = button.text;
    quizbutton.style.backgroundColor = button.color;
    quizbutton.addEventListener("click", () => nextQuestion(index));
    buttonHolder.appendChild(quizbutton);
}
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
    const weights = [1, 0.5, 0, -0.5, -1];
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