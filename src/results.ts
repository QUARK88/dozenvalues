import { changePage, Page } from "."
import { resultsHtml } from "./pages/results"

export function results() {
	document.body.innerHTML = resultsHtml()
	document.getElementById("backButton").addEventListener("click", () => {
		changePage(Page.index)
	})
}
