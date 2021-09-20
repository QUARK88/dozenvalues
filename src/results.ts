import { changePage, Page } from "."
import style from "./css/style.css"
import { resultsHtml } from "./pages/results"

export function results() {
	document.body.innerHTML = resultsHtml() + `<style>${style}</style>`
	document.getElementById("backButton").addEventListener("click", () => {
		changePage(Page.index)
	})
}
