import { getLanguage } from "./common.js";
const params = new URLSearchParams(document.location.search);
let lang = params.get("lang") ?? "en";
const ui = getLanguage(lang);
lang = ui.lang ?? lang;
for (const elm of Object.keys(ui.instructiontext)) {
    document.getElementById(elm).textContent = ui.instructiontext[elm];
}
document.title = ui.instructiontext.title;
document.getElementById("quiz_button").addEventListener("click", () => window.location.href = "quiz.html?lang=" + lang);
document.getElementById("quiz_random_button").addEventListener("click", () => window.location.href = "quiz.html?lang=" + lang + "&rand=true");
document.getElementById("back_button").addEventListener("click", () => window.location.href = "index.html?lang=" + lang);
//# sourceMappingURL=instructions.js.map