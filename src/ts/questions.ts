import { getJson, getLanguage } from "./common.js"
import type {Ui, Question, Value} from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang

for(const [key,value] of Object.entries(ui.questionstext)) {
    document.getElementById(key)!.textContent = value
}
//Button to lister.hmtl
document.getElementById("lister_button")!.addEventListener<"click">("click", () =>
    window.location.href = `lister.html?lang=${lang}`
)
//Button to matches.html
document.getElementById("matches_button")!.addEventListener<"click">("click", () => {
    window.location.href = `matches.html?lang=${lang}`
})
//Button to custom.html
document.getElementById("custom_button")!.addEventListener<"click">("click",() =>
    window.location.href = `custom.html?lang=${lang}`
)

const questions: Question[] = getJson("questions-" + lang)
const questionHolder = <HTMLDivElement> document.getElementById("questionholder")!

const elmMaker = (eff:number,val: Value): HTMLDivElement => {
    const mainElm = document.createElement("div")
    mainElm.className = "value-holder"
    const imgElm = new Image()
    imgElm.src = val.icon
    const scoreElm = document.createElement("div")
    scoreElm.className = "value-score"
    const scoreTxt = document.createElement("p")
    scoreTxt.textContent = eff.toFixed()
    scoreElm.appendChild(scoreTxt)
    scoreElm.style.backgroundColor = val.color
    mainElm.appendChild(imgElm)
    mainElm.appendChild(scoreElm)
    return mainElm
}

for(const question of questions) {
    const parentElm = document.createElement("div")
    parentElm.className = "question-holder"
    const questionText = document.createElement("div")
    questionText.className = "question-text"
    questionText.textContent = question.text
    parentElm.appendChild(questionText)
    question.effect.forEach( (eff,ind) => {
        if(eff > 0) {
            parentElm.appendChild(
                elmMaker(
                    eff,
                    ui.axes[ind].leftvalue
                )
            )
        } else if(eff < 0) {
            parentElm.appendChild(
                elmMaker(
                    Math.abs(eff),
                    ui.axes[ind].rightvalue
                )
            )
        }
    })
    questionHolder.appendChild(parentElm)
}
