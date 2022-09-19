import { getJson, getLanguage, orderScores } from "./common.js"
import type { Ui, Ideology, Axis } from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
const scores: Array<number> = rawScores.split(",").map(v => parseFloat(v))
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.9, 1, 0.6, 0.6, 0.7]
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)
const maxValue = Math.max(...matches.map(x => x.score!))
console.log(maxValue)
const weighedMatches = matches.map(x => {
    const weighedScore = x.score!/maxValue
    x.score =  100*(1-weighedScore)
    return x
})
const matchholder = <HTMLDivElement> document.getElementById("matchholder")!
for(const m of weighedMatches) {
    const elm = document.createElement("p")
    elm.textContent = `${m.name} : ${m.score?.toFixed(1)}%`
    matchholder.appendChild(elm)
}