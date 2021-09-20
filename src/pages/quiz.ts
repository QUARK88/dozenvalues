import { buttons, general } from "../data"

var quizButtonHtml = ""

for (const button of buttons) {
	quizButtonHtml += `<button class="button" style="background-color:${button.color};" onMouseOver="this.style.backgroundColor='${button.focusColor}'" onMouseOut="this.style.backgroundColor='${button.color}'">${button.name}</button><br />`
}

export const quizHtml = `<h1>${general.title}</h1>
<hr />
<h2 style="text-align: center" id="questionNumber">Loading...</h2>
<p class="question" id="questionText"></p>
${quizButtonHtml}
<button class="small_button" id="backQButton">Back</button>`
