import { getJson, getLanguage, Canvas, matchAxisTier, orderScores, b64enc } from "./common.js";
class Canvas2 {
    canvas;
    ctx;
    font;
    titleFont;
    bgColor;
    fgColor;
    images = ["econ", "stat", "cult"];
    constructor(element, x, y, textFont, titleFont, fg, bg) {
        this.canvas = element;
        this.canvas.width = x;
        this.canvas.height = y;
        this.ctx = this.canvas.getContext("2d");
        this.font = textFont;
        this.titleFont = titleFont;
        this.fgColor = fg;
        this.bgColor = bg;
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, x, y);
    }
    drawImages() {
        this.images.forEach((v, i) => {
            const img = new Image();
            img.src = "./assets/" + v + "compass.svg";
            img.addEventListener("load", () => this.ctx.drawImage(img, ((i + 1) & 2) * 250, ((i + 1) & 1) * 500, 500, 500));
        });
    }
    setFontsize(size) {
        this.ctx.font = size.toFixed(0) + "px " + this.font;
    }
    drawBorders() {
        this.ctx.fillStyle = "black";
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(0, 496 * i, 1000, 8);
            this.ctx.fillRect(496 * i, 0, 8, 1000);
        }
    }
    drawheader(title, matches) {
        this.ctx.fillStyle = this.fgColor;
        this.ctx.font = "64px " + this.titleFont;
        this.ctx.fillText(title, 16, 64, 480);
        this.setFontsize(32);
        for (let i = 0; i < 3; i++) {
            const text = `${i + 1}. ${matches[i].name}`;
            this.ctx.fillText(text, 16, 112 + i * 40);
        }
    }
    drawAxis(index, value, axis, tier) {
        this.ctx.fillStyle = this.fgColor;
        this.setFontsize(24);
        let text = "";
        if (value >= 50) {
            text += value.toFixed(1) + "% " + axis.leftvalue.name;
        }
        else {
            text += (100 - value).toFixed(1) + "% " + axis.rightvalue.name;
        }
        text += ` (${tier})`;
        this.ctx.fillText(text, 16, 240 + 48 * index);
    }
    drawDot(postion, x, y) {
        x = 4.64 * (100 - x) + 18;
        y = 4.64 * (100 - y) + 18;
        x += (postion & 2) * 250;
        y += (postion & 1) * 500;
        this.ctx.fillStyle = "white";
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    }
}
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
const canvasElm2 = document.getElementById("results2");
const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"];
const canvas = new Canvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg);
const canvas2 = new Canvas2(canvasElm2, 1000, 1000, ui.font.text_font, ui.font.title_font, fg, bg);
canvas2.drawImages();
const version = ui.resultstext.version_name + ": " + window.VERSION;
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
const desc = document.getElementById("desc");
desc.textContent = matches[0].desc;
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
document.getElementById("lister_button").addEventListener("click", () => window.location.href = "lister.html?lang=" + lang +
    "&score=" + scores.map(x => x.toFixed(1)).join(","));
document.getElementById("questions_button").addEventListener("click", () => window.location.href = "questions.html?lang=" + lang);
document.getElementById("matches_button").addEventListener("click", () => {
    window.location.href = "matches.html?lang=" + lang +
        "&ideo=" + b64enc(matches[0].name);
});
document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
document.getElementById("download1").addEventListener("click", () => Canvas.downloadImage(canvasElm));
document.getElementById("download2").addEventListener("click", () => Canvas.downloadImage(canvasElm2));
const axisHolder = document.getElementById("axisholder");
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
    const labelelm = document.createElement("h2");
    labelelm.textContent = axisLabel;
    axisHolder.appendChild(labelelm);
    const axis_elm = document.createElement("div");
    axis_elm.className = "axis";
    const lft_img = new Image();
    lft_img.src = v.leftvalue.icon;
    const rgt_img = new Image();
    rgt_img.src = v.rightvalue.icon;
    const divgen = (right, color, value) => {
        const parentDiv = document.createElement("div");
        parentDiv.className = "bar";
        parentDiv.style.backgroundColor = color;
        parentDiv.style.width = value.toFixed(1) + "%";
        if (right) {
            parentDiv.style.borderLeftStyle = "solid";
            parentDiv.style.textAlign = "right";
        }
        else {
            parentDiv.style.borderRightStyle = "solid";
            parentDiv.style.textAlign = "left";
        }
        if (value > 20) {
            const childDiv = document.createElement("div");
            childDiv.className = "text-wrapper";
            childDiv.textContent = value.toFixed(1) + "%";
            parentDiv.appendChild(childDiv);
        }
        return parentDiv;
    };
    axis_elm.appendChild(lft_img);
    axis_elm.appendChild(divgen(false, v.leftvalue.color, scores[i]));
    axis_elm.appendChild(divgen(true, v.rightvalue.color, (100 - scores[i])));
    axis_elm.appendChild(rgt_img);
    axisHolder.appendChild(axis_elm);
});
window.onload = () => {
    canvas.drawHeader(ui.resultstext.text.title, "quark88.github.io/dozenvalues/", version, matches[0].name);
    canvas2.drawBorders();
    canvas2.drawheader(ui.resultstext.text.title, matches);
    ui.axes.forEach((v, i) => {
        canvas2.drawAxis(i, scores[i], ui.axes[i], axisLabels[i].split(": ")[1]);
        if (i % 2 === 0) {
            const postion = Math.floor(i / 2) + 1;
            const [x, y] = postion === 2 ? [scores[i + 1], scores[i]] : [scores[i], scores[i + 1]];
            canvas2.drawDot(postion, x, y);
        }
        const icons = [v.leftvalue.icon, v.rightvalue.icon];
        canvas.drawImages(icons, i);
        const colors = [v.leftvalue.color, v.rightvalue.color];
        canvas.drawBar(i, colors, scores[i], axisLabels[i]);
    });
};
//# sourceMappingURL=results.js.map