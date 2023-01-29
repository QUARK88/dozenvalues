export function getJson(name) {
    const request = new XMLHttpRequest();
    request.open("GET", "./dist/json/" + name + ".json", false);
    request.send(null);
    return JSON.parse(request.responseText);
}
export function getLanguage(lang) {
    try {
        const ui = getJson("ui-" + lang);
        return ui;
    }
    catch (e) {
        console.error(e);
        alert(lang + " is not a valid language");
    }
    return getLanguage("en");
}
export function b64enc(input) {
    const codeUnits = Uint16Array.from({ length: input.length }, (_, index) => input.charCodeAt(index));
    const charCodes = new Uint8Array(codeUnits.buffer);
    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return btoa(result);
}
export function b64dec(input) {
    const dec = atob(input);
    const bytes = Uint8Array.from({ length: dec.length }, (_, index) => dec.charCodeAt(index));
    const charCodes = new Uint16Array(bytes.buffer);
    let result = "";
    charCodes.forEach((char) => {
        result += String.fromCharCode(char);
    });
    return result;
}
export function matchAxisTier(score, labels) {
    if (score < 0 || score > 100 || Number.isNaN(score))
        throw new Error(`Invalid score: ${score}%`);
    const tiers = [10, 25, 45, 54.9, 74.9, 89.9, 100];
    for (let i = 0; i < tiers.length; i++) {
        const lb = tiers[i - 1] ?? 0;
        const ub = tiers[i];
        if (score >= lb && score <= ub)
            return labels[i];
    }
    throw new Error("Missing label");
}
export function orderScores(scores, weights, ideologies) {
    const len = scores.length;
    for (const id of ideologies) {
        let sum = 0;
        for (let i = 0; i < len; i++) {
            const rawdelta = Math.abs(scores[i] - id.stats[i]);
            sum += weights[i] * Math.pow(rawdelta / 100, 3);
        }
        sum /= len;
        id.score = sum;
    }
    ideologies.sort((a, b) => (a.score - b.score));
    return ideologies;
}
export class Canvas {
    canvas;
    ctx;
    font;
    titleFont;
    bgColor;
    fgColor;
    constructor(element, x, y, textFont, titleFont, fg, bg) {
        this.canvas = element;
        this.canvas.width = x;
        this.canvas.height = y;
        this.ctx = this.canvas.getContext("2d");
        this.font = textFont;
        this.titleFont = titleFont;
        this.bgColor = bg;
        this.fgColor = fg;
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, x, y);
    }
    setFontsize(size) {
        this.ctx.font = size.toFixed(0) + "px " + this.font;
    }
    drawHeader(title, url, version, date, match) {
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, 180);
        this.ctx.fillStyle = this.fgColor;
        this.ctx.textAlign = "start";
        this.ctx.font = "64px " + this.titleFont;
        this.ctx.fillText(title, 32, 80, 490);
        this.ctx.textAlign = "end";
        this.setFontsize(16);
        this.ctx.fillText(url, 768, 40);
        this.ctx.fillText(version, 768, 64);
        this.ctx.fillText(date, 768, 88);
        this.ctx.textAlign = "left";
        this.setFontsize(48);
        this.ctx.fillText(match, 32, 144, this.canvas.width - 64);
    }
    drawBar(index, colors, score, axis) {
        const h = index * 112, h0 = h + 160, h1 = h + 208, h2 = h + 214, h3 = h + 252, h4 = h + 192;
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(128, h0, 544, 112);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(128, h1, 544, 64);
        this.ctx.fillStyle = colors[0];
        const w1 = 5.44 * score - 3;
        if (score > 0)
            this.ctx.fillRect(128, h2, w1, 52);
        this.ctx.fillStyle = colors[1];
        const d1 = 403 - (5.44 * (50 - score));
        const w2 = 5.44 * (100 - score) - 3;
        if (score < 100)
            this.ctx.fillRect(d1, h2, w2, 52);
        this.setFontsize(32);
        this.ctx.fillStyle = "#080808";
        if (score > 20) {
            this.ctx.textAlign = "left";
            const val = score.toFixed(1) + "%";
            this.ctx.fillText(val, 136, h3);
        }
        if (score < 80) {
            this.ctx.textAlign = "right";
            const val = (100 - score).toFixed(1) + "%";
            this.ctx.fillText(val, 664, h3);
        }
        this.ctx.fillStyle = this.fgColor;
        this.ctx.textAlign = "center";
        this.setFontsize(24);
        this.ctx.fillText(axis, 400, h4);
    }
    drawImages(images, index) {
        images.forEach((v, i) => {
            const h = 192 + index * 112, w = 32 + i * 640, img = new Image();
            img.src = v;
            img.addEventListener("load", () => this.ctx.drawImage(img, w, h, 96, 96));
        });
    }
    static downloadImage(canvas) {
        const link = document.createElement("a");
        link.download = "DozenValues.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }
}
//# sourceMappingURL=common.js.map