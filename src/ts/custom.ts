import { getLanguage, Canvas, matchAxisTier } from "./common.js"
import type { Ui } from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const version: string = ui.resultstext.version_name + ": " + window.VERSION
const canvasElm = <HTMLCanvasElement>document.getElementById("score")!
const dark: boolean = window.matchMedia?.("(prefers-color-scheme: dark)").matches
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"]

for (const [key, value] of Object.entries(ui.customtext)) {
    document.getElementById(key)!.textContent = value
}
//Download canvas button
document.getElementById("download_button")!.addEventListener<"click">("click", () =>
    Canvas.downloadImage(canvasElm)
)
//Button to questions.html
document.getElementById("questions_button")!.addEventListener<"click">("click", () =>
    window.location.href = "questions.html?lang=" + lang
)
//Button to matches.html
document.getElementById("matches_button")!.addEventListener<"click">("click", () =>
    window.location.href = "matches.html?lang=" + lang
)
document.getElementById("back_button")!.addEventListener<"click">("click", () =>
    window.location.href = "index.html?lang=" + lang
)

class TouchCanvas extends Canvas {
    public state: Array<number>
    private name: string
    constructor(element: HTMLCanvasElement, x: number, y: number, textFont: string, titleFont: string, fg: string, bg: string) {
        super(element, x, y, textFont, titleFont, fg, bg)
        this.canvas.addEventListener("click", event =>
            this.clicked(event, this.canvas))
        this.state = Array(6).fill(50)
        ui.axes.forEach((axis, ind) => {
            const images = [axis.leftvalue.icon, axis.rightvalue.icon]
            this.drawImages(images, ind)
        })
        this.name = "Ideology"
        this.drawState()
    }
    clicked(event: MouseEvent, canvas: HTMLCanvasElement) {
        const bounds = canvas.getBoundingClientRect()
        const [x, y] = [
            event.clientX - bounds.x,
            event.clientY - bounds.y
        ]
        //Bar
        if (x > 132 && x < 676 && y > 208 && ((y - 208) % 112) < 64) {
            const index = Math.floor((y - 208) / 112)
            const perc = Math.round(20 * ((x - 132) / (676 - 132)))
            this.state[index] = perc * 5
        }
        //Name
        else if (y > 100 && y < 180) {
            this.name = window.prompt("Insert ideology name:") ?? this.name
        }
        //Left icon
        else if (y > 192 && x < 132 && x > 36 && ((y - 196) % 112) < 96) {
            const index = Math.floor((y - 192) / 112)
            if (this.state[index] <= 95)
                this.state[index] += 5
        }
        //Right icon
        else if (y > 192 && x > 676 && x < 772 && ((y - 196) % 112) < 96) {
            const index = Math.floor((y - 192) / 112)
            if (this.state[index] >= 5)
                this.state[index] -= 5
        }
        //Nothing
        else {
            return
        }
        this.drawState()
    }
    drawState() {
        this.drawHeader(
            ui.resultstext.text.title,
            "quark88.github.io/dozenvalues/",
            version,
            this.name
        )
        this.state.forEach((stat, ind) => {
            const colors = [ui.axes[ind].leftvalue.color, ui.axes[ind].rightvalue.color]
            const tier = matchAxisTier(stat, ui.axes[ind].tiers)
            let axisLabel
            if (ui.resultstext.axis_name_before) {
                axisLabel = `${ui.resultstext.axis_name} ${ui.axes[ind].axisname}: ${tier}`
            } else {
                axisLabel = `${ui.axes[ind].axisname} ${ui.resultstext.axis_name}: ${tier}`
            }
            this.drawBar(ind, colors, stat, axisLabel)
        })
    }
}

window.onload = () => {
    const canvas = new TouchCanvas(canvasElm, 800, 880, ui.font.text_font, ui.font.title_font, fg, bg)
    //Button to lister.html
    document.getElementById("lister_button")!.addEventListener<"click">("click", () =>
        window.location.href = "lister.html?lang=" + lang +
        "&score=" + canvas.state.map(x => x.toFixed()).join(",")
    )
}