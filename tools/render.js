const pug = require("pug")
const fs = require("fs")

const dirName = "./src/views/"
const viewsDir = fs.readdirSync(dirName)

const params = {
    version : process.env.npm_package_version,
    discord : true,
    inline_js: false
};

(() => {
    const src_dir_name = "./src/json/"
    const dist_dir_name = "./dist/json/"
    //Blacklist
    const blacklist = ["ui-de"]

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

for(const file of viewsDir) {
    const split = file.split(".")
    if(split[1] === "pug") {
        const html = pug.renderFile(dirName+file,params)
        fs.writeFileSync(`./${split[0]}.html`,html)
    }
}

