const fs = require("fs");

const dist_dir_names = ["./dist/","./dist/json/"]

for(const dir of dist_dir_names) {
    const files = fs.readdirSync(dir,{withFileTypes: true})
    for(const f of files) {
        if(f.isFile()) {
            fs.unlinkSync(dir+f.name)
        }
    }
}