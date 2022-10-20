const pug = require("pug")
const fs = require("fs")
const terser = require("terser")
const blacklist = require("./blacklist.json");

(() => {
    const src_dir_name = "./src/json/"
    const dist_dir_name = "./dist/json/"

    const src_dir = fs.readdirSync(src_dir_name)
    for (const file of src_dir) {
        const split = file.split(".")
        if (split[1] == "json" && !(blacklist.includes(split[0]))) {
            const obj = JSON.parse(
                fs.readFileSync(
                    src_dir_name + file,
                    { encoding: "utf8" }
                ))
            fs.writeFileSync(
                dist_dir_name + file,
                JSON.stringify(obj),
                { encoding: "utf8" }
            )
        }
    }
})();

//js minifier
const minifyJs = async () => {
    const minifiedJs = {}
    const dir_name = "./dist/"
    const dir = fs.readdirSync(dir_name)
    for (const file of dir) {
        const split = file.split(".")
        if (split[1] == "js" && split[2] == undefined) {
            const raw = fs.readFileSync(
                dir_name + file,
                { encoding: "utf8" }
            )
            const map = fs.readFileSync(
                dir_name + file + ".map",
                { encoding: "utf8" }
            )
            const params = {
                compress: {
                    ecma: 2022
                },
                module: true,
                toplevel: true
            }
            const min = await terser.minify(raw, params)

            minifiedJs[split[0]] = min.code.replace("./common.js","./dist/common.js")

            fs.unlinkSync(
                dir_name + file + ".map"
            )
            if(split[0] !== "common") {
                fs.unlinkSync(
                    dir_name + file
                )
            } else {
                fs.writeFileSync(
                    dir_name + file,
                    min.code,
                    { encoding: "utf8" }
                )
            }
        }
    }
    return minifiedJs
}

(async () => {
    const dirName = "./src/views/"
    const viewsDir = fs.readdirSync(dirName)

    const params = {
        version : process.env.npm_package_version,
        discord : true,
        inline_js: true,
        js : await minifyJs()
    }
    //console.log(params.js.index)
    for(const file of viewsDir) {
        
        const split = file.split(".")
        if(split[1] === "pug") {
            const html = pug.renderFile(dirName+file,params)
            fs.writeFileSync(`./${split[0]}.html`,html)
        }
    }
})()