import { getJson, getLanguage, orderScores, b64enc } from "./common.js"
import type { Ui, Ideology } from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
let scores: Array<number> = rawScores.split(",").map(v => parseFloat(v))
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.9, 1, 0.6, 0.6, 0.7]
if(scores.length != 6 || !scores.every(x => x>=0 && x<=100)) {
    scores = new Array(6).fill(50)
}
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)

for(const [key,value] of Object.entries(ui.listertext)) {
    document.getElementById(key)!.textContent = value
}

//Button to questions.html
const questionsButton = document.getElementById("questions_button")!
questionsButton.addEventListener<"click">("click",() =>
    window.location.href = `questions.html?lang=${lang}`
)
//Button to matches.html
const matchesButton = document.getElementById("matches_button")!
matchesButton.addEventListener<"click">("click", () => {
    window.location.href = "matches.html?lang=" + lang +
    "&ideo=" + b64enc(matches[0].name)
})

const abscheck = <HTMLInputElement> document.getElementById("abs")
abscheck.addEventListener("click", () => {

    displayMatches(matches,abscheck.checked)
})

displayMatches(matches,abscheck.checked)

function displayMatches(matches: Ideology[], absolute: boolean=false) {
    const maximum = scores.map(x => Math.max(x,100-x))
    let max = 0
    for(let i=0;i<maximum.length;i++){
        max += weights[i] * Math.pow(maximum[i] / 100, 3)
    }
    max /= maximum.length
    const maxValue = Math.max(...matches.map(x => x.score!))
    const weighedMatches = matches.map(x => {
        const weighedScore = x.score!/(absolute? maxValue : max)
        const obj = {} as Ideology
        obj.score =  100*(1-weighedScore)
        obj.name = x.name
        return obj
    })
    const matchholder = <HTMLDivElement> document.getElementById("matchholder")!
    matchholder.innerHTML = ""
    weighedMatches.forEach( (v,i) => {
        const elm = document.createElement("a")
        elm.className = "match-text"
        elm.textContent = `${i+1}: ${v.name} : ${v.score?.toFixed(1)}%`
        elm.href= `matches.html?lang=${lang}&ideo=${b64enc(v.name)}`
        matchholder.appendChild(elm)
    })
}
