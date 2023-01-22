import { Ui, Ideology } from "./types"

/*const box = document.getElementById("box")
function switchtheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches == true) {
        if (box.checked == true) {
            //Light
        } else {
            //Dark
        }
    } else {
        if (box.checked == true) {
            //Dark
        } else {
            //Light
        }
    }
}*/

export function getJson(name: string): any {
    const request: XMLHttpRequest = new XMLHttpRequest()
    request.open("GET", "./dist/json/" + name + ".json", false)
    request.send(null)
    return JSON.parse(request.responseText)
}

export function getLanguage(lang: string): Ui {
    try {
        const ui: Ui = getJson("ui-" + lang)
        return ui
    } catch (e) {
        console.error(e)
        alert(lang + " is not a valid language")
    }
    return getLanguage("en")
}

export function b64enc(input: string): string {
    const codeUnits: Uint16Array = Uint16Array.from(
        { length: input.length },
        (_, index) => input.charCodeAt(index)
    )
    const charCodes: Uint8Array = new Uint8Array(codeUnits.buffer)

    let result: string = ""
    charCodes.forEach((char) => {
        result += String.fromCharCode(char)
    })
    return btoa(result)
}

export function b64dec(input: string): string {
    const dec: string = atob(input)
    const bytes: Uint8Array = Uint8Array.from(
        { length: dec.length },
        (_, index) => dec.charCodeAt(index)
    )
    const charCodes: Uint16Array = new Uint16Array(bytes.buffer)

    let result: string = ""
    charCodes.forEach((char) => {
        result += String.fromCharCode(char)
    })
    return result
}

export function matchAxisTier(score: number, labels: Array<string>): string {
    if (score < 0 || score > 100 || Number.isNaN(score)) throw new Error(`Invalid score: ${score}%`)
    const tiers = [10, 25, 45, 54.9, 74.9, 89.9, 100]
    for (let i = 0; i < tiers.length; i++) {
        const lb = tiers[i - 1] ?? 0
        const ub = tiers[i]
        if (score >= lb && score <= ub)
            return labels[i]
    }
    throw new Error("Missing label")
}

export function orderScores(
    scores: Array<number>,
    weights: Array<number>,
    ideologies: Array<Ideology>): Array<Ideology> {

    const len = scores.length
    for (const id of ideologies) {
        let sum = 0
        for (let i = 0; i < len; i++) {
            const rawdelta = Math.abs(scores[i] - id.stats[i])
            sum += weights[i] * Math.pow(rawdelta / 100, 3)
        }
        sum /= len
        id.score = sum
    }
    ideologies.sort((a, b) => (a.score! - b.score!))
    return ideologies
}

export class Canvas {
    protected canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private font: string
    private titleFont: string
    private bgColor: string
    private fgColor: string

    constructor(element: HTMLCanvasElement, x: number, y: number, textFont: string, titleFont: string, fg: string, bg: string) {
        //Sets canvas
        this.canvas = <HTMLCanvasElement>element
        this.canvas.width = x
        this.canvas.height = y
        //Grabs 2d context
        this.ctx = this.canvas.getContext("2d")!
        //Loads font, bg and fg colors to class private variables
        this.font = textFont
        this.titleFont = titleFont
        this.bgColor = bg
        this.fgColor = fg
        //Draws background
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(0, 0, x, y)
    }
    private setFontsize(size: number): void {
        this.ctx.font = size.toFixed(0) + "px " + this.font
    }
    drawHeader(title: string, url: string, version: string, date: string, match: string): void {
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(0, 0, this.canvas.width, 180)
        //Draws title
        this.ctx.fillStyle = this.fgColor
        this.ctx.textAlign = "start"
        this.ctx.font = "64px " + this.titleFont
        this.ctx.fillText(title, 32, 80, 490)
        //Draws url
        this.ctx.textAlign = "end"
        this.setFontsize(16)
        this.ctx.fillText(url, 768, 40)
        //Draws version 
        this.ctx.fillText(version, 768, 64)
        //Draws date
        this.ctx.fillText(date, 768, 88)
        //Draws match
        this.ctx.textAlign = "left"
        this.setFontsize(48)
        this.ctx.fillText(match, 32, 144, this.canvas.width - 64)
    }
    drawBar(index: number, colors: Array<string>, score: number, axis: string): void {
        const
            h = index * 112,
            h0 = h + 160,
            h1 = h + 208,
            h2 = h + 214,
            h3 = h + 252,
            h4 = h + 192
        //Blank out previous result
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(128, h0, 544, 112)
        //Draw background
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(128, h1, 544, 64)
        //Draw left bar
        this.ctx.fillStyle = colors[0]
        const w1 = 5.44 * score - 3
        if (score > 0)
            this.ctx.fillRect(128, h2, w1, 52)
        //Draw right bar
        this.ctx.fillStyle = colors[1]
        const d1 = 403 - (5.44 * (50 - score))
        const w2 = 5.44 * (100 - score) - 3
        if (score < 100)
            this.ctx.fillRect(d1, h2, w2, 52)
        //Draw score percentages
        this.setFontsize(32)
        this.ctx.fillStyle = "#080808"
        if (score > 20) {
            this.ctx.textAlign = "left"
            const val = score.toFixed(1) + "%"
            this.ctx.fillText(val, 136, h3)
        }
        if (score < 80) {
            this.ctx.textAlign = "right"
            const val = (100 - score).toFixed(1) + "%"
            this.ctx.fillText(val, 664, h3)
        }
        //Draw axis label
        this.ctx.fillStyle = this.fgColor
        this.ctx.textAlign = "center"
        this.setFontsize(24)
        this.ctx.fillText(axis, 400, h4)
    }
    drawImages(images: Array<string>, index: number): void {
        images.forEach((v, i) => {
            const
                h = 192 + index * 112,
                w = 32 + i * 640,
                img = new Image()
            img.src = v
            img.addEventListener("load", () =>
                this.ctx.drawImage(img, w, h, 96, 96)
            )
        })
    }
    static downloadImage(canvas: HTMLCanvasElement) {
        const link = document.createElement("a")
        link.download = "DozenValues.png"
        link.href = canvas.toDataURL("image/png")
        link.click()
    }
}