import { getJson, getLanguage, Canvas, matchAxisTier, b64dec } from "./common.js"
import type {Ui, Ideology} from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const version: string = ui.resultstext.version_name + ": " + window.VERSION
const matches: Ideology[] = getJson("ideologies-" + lang)
const canvasElm = <HTMLCanvasElement> document.getElementById("match")!
const dark: boolean = window.matchMedia?.("(prefers-color-scheme: dark)").matches
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"]
const canvas = new Canvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg)
const dropDown = <HTMLSelectElement> document.getElementById("match-dropdown")!
const matchText = <HTMLDivElement> document.getElementById("match-text")

matches.forEach( (match,ind) => {
    const opt = document.createElement("option")
    opt.value = ind.toFixed()
    opt.textContent = match.name
    dropDown.appendChild(opt)
})

ui.axes.forEach((axis,ind) => {
    const images = [axis.leftvalue.icon,axis.rightvalue.icon]
    canvas.drawImages(images,ind)
})

for(const [key,value] of Object.entries(ui.matchestext)) {
    document.getElementById(key)!.textContent = value
}

//Button to lister.hmtl
const fullList = document.getElementById("lister_button")!
fullList.addEventListener<"click">("click", () => {
    const index = parseInt(dropDown.value)
    window.location.href = "lister.html?lang=" + lang + 
    "&score=" + matches[index].stats.map(x => x.toFixed(1)).join(",")
})
//Button to questions.html
const questionsButton = document.getElementById("questions_button")!
questionsButton.addEventListener<"click">("click",() =>
    window.location.href = `questions.html?lang=${lang}`
)


function changedSelection(match: Ideology):void {
    canvas.drawHeader(
        ui.resultstext.text.title,
        "quark88.github.io/dozenvalues/",
        version,
        match.name
    )
    match.stats.forEach( (stat,ind) => {
        const colors = [ui.axes[ind].leftvalue.color, ui.axes[ind].rightvalue.color]
        const tier = matchAxisTier(stat,ui.axes[ind].tiers)
        let axisLabel
        if (ui.resultstext.axis_name_before) {
            axisLabel = `${ui.resultstext.axis_name} ${ui.axes[ind].axisname}: ${tier}`
        } else {
            axisLabel = `${ui.axes[ind].axisname} ${ui.resultstext.axis_name}: ${tier}`
        }
        canvas.drawBar(ind, colors, stat, axisLabel)
    })
    matchText.textContent = match.desc
}


window.onload = () => {
    const ideo = params.get("ideo")
    if(ideo) {
        try {
            const decIdeo = b64dec(ideo)
            const matched = matches.find(x => x.name === decIdeo) ?? matches[0]
            changedSelection(matched)
            dropDown.selectedIndex = matches.indexOf(matched)
        } catch(e:any) {
            console.error(e)
            changedSelection(matches[0])
        }
    } else {
        changedSelection(matches[0])
    }
}

dropDown.addEventListener<"change">("change", () => {
    const index = parseInt(dropDown.value)
    changedSelection(matches[index])
})