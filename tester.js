const ideos = require("./ideologies.json")
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function calcaxis(v1, v2) {
    const V1 = parseFloat(v1)
    const V2 = parseFloat(v2)
    return Math.pow(Math.abs(V1 - V2) / 100, 20)
    //return Math.abs(V1-V2)/100
    //return Math.log(Math.abs(V1-V2)/100)
}

const keys = ["A1", "A2", "A3", "A4", "A5", "A6"]
const weights = [1, 0.95, 1, 0.6, 0.6, 0.7]

rl.question("input values: ", name => {
    const userideo = name.split(" ")
    if (userideo.length != 6)
        throw new Error("invalid input")
    let matches = new Array()
    for (const id of ideos) {
        let sum = new Number()
        for (const key in keys) {
            sum += weights[key] * calcaxis(userideo[key], id.stats[keys[key]])
        }
        sum /= 6
        matches.push({
            "ideology": id.name,
            "score": sum
        })
    }
    matches.sort((a, b) => (a.score - b.score))
    for (const i in matches) {
        console.log(i, matches[i].ideology)
    }
    process.exit(0)
})
