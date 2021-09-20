import { general } from "../data"

export const instructions = `<h1>${general.title}</h1>
<hr />
<h2 style="text-align: center">Instructions</h2>
<p class="question">
	You will be presented with a series of statements. For each one, click the
	button with your opinion on it.
</p>
<button class="button" id="quizButton">Got it!</button>
<br />
<button class="button disagree" id="backButton">
	Wait, nevermind!
</button>
<br />`
