import { getJson } from "./common.js";
(function () {
    const langs = getJson("langs");
    const langDropdown = document.getElementById("langDropdown");
    let langList = new Array();
    for (const lang of langs) {
        const opt = document.createElement("option");
        opt.value = lang.id;
        opt.textContent = lang.name;
        langList.push(lang.id);
    }
    const params = new URLSearchParams(document.location.search);
    const lang = params.get("lang") ?? "en";
    const changeLang = (lang) => {
        try {
            const ui = getJson("ui-" + lang);
            loadUI(ui, lang);
            params.set("lang", lang);
            const newPath = document.location.origin +
                window.location.pathname + "?" + params.toString();
            window.history.replaceState(null, document.title, newPath);
        }
        catch (e) {
            console.error(e);
            alert(lang + " is not a valid language");
            changeLang("en");
        }
    };
    changeLang(lang);
})();
function loadUI(ui, lang) {
    const collumn_holder = document.getElementById("column-holder"), valuesExplaination = document.getElementById("values-explaination"), creditsList = document.getElementById("credits-list");
    const clearElm = (elm) => {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }
    };
    clearElm(collumn_holder);
    clearElm(valuesExplaination);
    clearElm(creditsList);
    document.getElementById("start_button").addEventListener("click", () => window.location.href = "instructions.html?lang=" + lang);
    document.getElementById("matches_button").addEventListener("click", () => window.location.href = "matches.html?lang=" + lang);
    document.getElementById("lister_button").addEventListener("click", () => window.location.href = "lister.html?lang=" + lang);
    document.getElementById("questions_button").addEventListener("click", () => window.location.href = "questions.html?lang=" + lang);
    document.getElementById("custom_button").addEventListener("click", () => window.location.href = "custom.html?lang=" + lang);
    for (const axis of ui.axes) {
        const column = document.createElement("div");
        column.className = "column";
        const axis_name = document.createElement("div");
        axis_name.className = "block";
        const label_elm = document.createElement("div");
        label_elm.className = "axis_label";
        label_elm.textContent = axis.axisname.toUpperCase();
        axis_name.appendChild(label_elm);
        const createAnchor = (value) => {
            const elm = document.createElement("a");
            elm.href = "#anchor-" + axis.axisname.toLowerCase();
            const img = new Image();
            img.src = value.icon;
            img.className = "quadcolumn";
            elm.appendChild(img);
            return elm;
        };
        axis_name.appendChild(createAnchor(axis.leftvalue));
        axis_name.appendChild(createAnchor(axis.rightvalue));
        collumn_holder.appendChild(axis_name);
        const spacer = document.createElement("div");
        spacer.className = "spacer";
        const createBlurb = (side, val) => {
            const baseElm = document.createElement("div");
            baseElm.className = "explanation_blurb_" + side;
            const valdiv = document.createElement("p");
            valdiv.className = "value";
            const valname = document.createElement("b");
            valname.textContent = val.name.toUpperCase();
            valname.style.color = val.color;
            valdiv.appendChild(valname);
            const blurbText = document.createElement("p");
            blurbText.textContent = val.blurb;
            blurbText.className = "blurb-text";
            baseElm.appendChild(valdiv);
            baseElm.appendChild(blurbText);
            return baseElm;
        };
        spacer.appendChild(createBlurb("left", axis.leftvalue));
        const expAxis = document.createElement("div");
        const axisName = document.createElement("p");
        axisName.textContent = axis.axisname.toUpperCase();
        axisName.className = "axis_name";
        const expAnchor = document.createElement("a");
        expAnchor.id = "anchor-" + axis.axisname.toLowerCase();
        expAxis.appendChild(axisName);
        expAxis.appendChild(expAnchor);
        expAxis.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="71.2522" height="21.8695" viewBox="0 0 406.4 135.46666667" class="arrow"><path fill="none" stroke="#404040" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m338.66666 101.6 50.8-33.866668-50.8-33.866666m-270.933328 0L16.933333 67.73333 67.733332 101.6M16.933333 67.73333H389.46666"></path></svg>';
        spacer.appendChild(expAxis);
        spacer.appendChild(createBlurb("right", axis.rightvalue));
        valuesExplaination.appendChild(spacer);
    }
    for (const i of Object.keys(ui.indextext.rawtext)) {
        document.getElementById(i).textContent = ui.indextext.rawtext[i];
    }
    for (const i of Object.keys(ui.indextext.htmltext)) {
        document.getElementById(i).innerHTML = ui.indextext.htmltext[i];
    }
    document.title = ui.indextext.rawtext.title;
    for (const credit of ui.indextext.creditslist) {
        const creditSpan = document.createElement("div"), linkWrapper = document.createElement("div"), creditName = document.createElement("div"), creditRoles = document.createElement("div"), creditImg = new Image();
        creditSpan.className = "entry";
        creditRoles.textContent = credit.role;
        creditName.className = "tag";
        creditImg.src = credit.img;
        creditName.textContent = credit.tag;
        linkWrapper.className = "credit-wrapper";
        creditSpan.addEventListener("click", () => location.href = "./results.html?lang=" + lang + "&score=" +
            credit.score.map(x => x.toFixed(1)).join(",") + "&send=no");
        ((...divs) => divs.forEach(div => linkWrapper.appendChild(div)))(creditName, creditRoles);
        ((...divs) => divs.forEach(div => creditSpan.appendChild(div)))(creditImg, linkWrapper);
        creditsList.appendChild(creditSpan);
    }
}
//# sourceMappingURL=index.js.map