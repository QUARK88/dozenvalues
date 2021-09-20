import { axes, general } from "../data"

// TODO: ideology stuff

export function resultsHtml() {
	const resultEffects = location.href
		.split("?")[1]
		.split(",")
		.map((item) => {
			return parseFloat(item)
		})

	var resultsAxisHtml = ""

	var matchings: string[] = []

	for (let i = 0; i < axes.length; i++) {
		var sum = 0
		var tiers: number[] = []
		for (let i2 = 0; i2 < axes[i].tiers.length; i2++) {
			sum += 100 / axes[i].tiers.length
			tiers[i2] = sum
		}

		for (let i2 = 0; i2 < tiers.length; i2++) {
			if (resultEffects[i] < tiers[i2]) {
				matchings[i] = axes[i].tiers.reverse()[i2]
				break
			}
		}
	}

	for (let i = 0; i < axes.length; i++) {
		const axis = axes[i]

		resultsAxisHtml += `<h2>${axis.name} Axis: ${
			matchings[i]
		}<span class="weight-300" id="economic-label"></span></h2><div class="axis"><img src="value_images/${
			axis.id
		}_0.svg" height="128pt" /><div style="background-color:${
			axis.left.color
		};border-right-style:solid;text-align:left;width:${
			resultEffects[i]
		}%" class="bar"><div class="text-wrapper">${
			resultEffects[i] > 30 ? resultEffects[i].toFixed(1) + "%" : ""
		}</div></div><div style="background-color:${
			axis.right.color
		};border-left-style:solid;text-align:right;width:${
			100 - resultEffects[i]
		}%" class="bar"><div class="text-wrapper">${
			100 - resultEffects[i] > 30
				? (100 - resultEffects[i]).toFixed(1) + "%"
				: ""
		}</div></div><img src="value_images/${
			axis.id
		}_1.svg"" height="128pt" /></div>`
	}

	return `<h1>${general.title}</h1>
<hr />
<h1>Results</h1>
${resultsAxisHtml}
<hr />
<img src="" id="banner" />
<button class="button" id="backButton">Back</button>
<br />`
}
