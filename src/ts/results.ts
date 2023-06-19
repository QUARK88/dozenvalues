import { getJson, getLanguage, Canvas, matchAxisTier, orderScores, b64enc } from "./common.js"
import type { Ui, Ideology, Axis } from "./types"

/*class Canvas2 {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private font: string
    private titleFont: string
    private bgColor: string
    private fgColor: string
    constructor(element: HTMLCanvasElement, x: number, y: number, textFont: string, titleFont: string, fg: string, bg: string) {
        //Assigns canvas property to class
        this.canvas = element
        this.canvas.width = x
        this.canvas.height = y
        this.ctx = this.canvas.getContext("2d")!
        this.font = textFont
        this.titleFont = titleFont
        this.fgColor = fg
        this.bgColor = bg
        //Draws background
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(0, 0, x, y)
        //The rest
        this.ctx.stroke()
    }
    private setFontsize(size: number): void {
        this.ctx.font = size.toFixed(0) + "px " + this.font
    }
    drawAxis(index: number, value: number, axis: Axis, tier: string): void {
        this.ctx.fillStyle = this.fgColor
        this.setFontsize(24)
        let text: string = "";
        if (value >= 50) {
            text += value.toFixed(1) + "% " + axis.leftvalue.name
        } else {
            text += (100 - value).toFixed(1) + "% " + axis.rightvalue.name
        }
        text += ` (${tier})`
        this.ctx.fillText(text, 16, 240 + 48 * index)
    }
}*/

//Grabs parameters and parses scores
const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang); lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
const scores: Array<number> = rawScores.split(",").map(v => {
    const score = parseFloat(v)
    if (Number.isNaN(score) || !Number.isFinite(score)) {
        return 50
    }
    return Math.max(Math.min(score, 100), 0)
})
if (scores.length < 6) {
    alert("Invalid result")
    throw new Error("Missing scores")
}
const send: boolean = !(params.get("send") === "no")
//Assigns canvas elements to constants
const canvasElm = <HTMLCanvasElement>document.getElementById("results1")!
//const canvasElm2 = <HTMLCanvasElement>document.getElementById("results2")!
//Finds color theme and sets colors accordingly 
const dark: boolean = window.matchMedia?.("(prefers-color-scheme: dark)").matches
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"]
//Create canvas objects and draws canvas 2 images (set here to avoid async functions)
const canvas: Canvas = new Canvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg)
//const canvas2: Canvas2 = new Canvas2(canvasElm2, 1024, 1024, ui.font.text_font, ui.font.title_font, fg, bg)
//Grabs test version from window object
const version: string = ui.resultstext.version_name + ": " + window.VERSION
var today = new Date()
const date = "Taken on: " + today.toISOString().substring(0, 10)
//Grabs ideologies list from json and parses their matches
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.9, 1, 0.6, 0.6, 0.7]
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)
//Adds the name to text only elements
for (const elm of Object.keys(ui.resultstext.text)) {
    document.getElementById(elm)!.textContent = ui.resultstext.text[elm]
}

document.title = ui.resultstext.text.title

//Adds match to div
const score1 = document.getElementById("score1")!
score1.textContent = `${ui.resultstext.closest_match}: ${matches[0].name}`
//Adds next closest scores
const score2 = document.getElementById("score2")!
score2.textContent = ui.resultstext.next_matches + ": "
let nextLabels: Array<string> = Array()
for (let i = 1; i < 5; i++) {
    nextLabels.push(matches[i].name)
}
score2.textContent += nextLabels.join(", ")
//Adds description
/*const desc = document.getElementById("desc")!
desc.textContent = matches[0].desc*/
//Button to index
document.getElementById("back_button")!.addEventListener<"click">("click", () =>
    window.location.href = "index.html?lang=" + lang
)
//Button to lister.hmtl
document.getElementById("lister_button")!.addEventListener<"click">("click", () =>
    window.location.href = "lister.html?lang=" + lang +
    "&score=" + scores.map(x => x.toFixed(1)).join(",")
)
//Button to questions.html
document.getElementById("questions_button")!.addEventListener<"click">("click", () =>
    window.location.href = "questions.html?lang=" + lang
)
//Button to matches.html
document.getElementById("matches_button")!.addEventListener<"click">("click", () => {
    window.location.href = "matches.html?lang=" + lang +
        "&ideo=" + b64enc(matches[0].name)
})

//Button to custom.html
document.getElementById("custom_button")!.addEventListener<"click">("click", () =>
    window.location.href = "custom.html?lang=" + lang
)
//Download buttons for canvas 1 and 2
document.getElementById("results1")!.addEventListener<"click">("click", () =>
    Canvas.downloadImage(canvasElm)
)
/*document.getElementById("results2")!.addEventListener<"click">("click", () =>
    Canvas.downloadImage(canvasElm2)
)*/

let axisLabels: Array<string> = Array()
ui.axes.forEach((v, i) => {
    //Finds axis label and composes result string, pushes to array
    const tier = matchAxisTier(scores[i], v.tiers)
    let axisLabel: string
    if (ui.resultstext.axis_name_before) {
        axisLabel = `${ui.resultstext.axis_name} ${v.axisname}: ${tier}`
    } else {
        axisLabel = `${v.axisname} ${ui.resultstext.axis_name}: ${tier}`
    }
    axisLabels.push(axisLabel)
})

/*//Gets compass coordinates
function sixtothree(a: number, b: number, c: number, d: number, e: boolean, f: boolean) {
    return Math.round(((a*scores[b]+c*scores[d])-50)/20)/10
}
const x = sixtothree(1.05, 0, .95, 1, true, true)
const y = sixtothree(1.2, 2, .8, 3, false, true)
const z = sixtothree(.857, 4, 1.143, 5, false, true)
console.log(x, y, z)*/

window.onload = () => {
    //Draws canvas 1 header
    canvas.drawHeader(
        ui.resultstext.text.title,
        "quark88.github.io/dozenvalues",
        version,
        date,
        matches[0].name)
    //For each axis draw axis (both canvas), images (canvas 1) and dots (canvas 2)
    ui.axes.forEach((v, i) => {
        const icons = [v.leftvalue.icon, v.rightvalue.icon]
        canvas.drawImages(icons, i)
        const colors = [v.leftvalue.color, v.rightvalue.color]
        canvas.drawBar(i, colors, scores[i], axisLabels[i])
    })
}
