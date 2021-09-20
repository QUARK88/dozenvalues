export interface Axis {
	id: string
	name: string
	left: Value
	right: Value
	tiers: string[]
}

export interface Value {
	name: string
	description: string
	color: string
}

export interface General {
	title: string
	github: string
	description: string
	valQuestion: string
	valDescription: string
}

export interface Button {
	name: string
	modifier: number
	color: string
	focusColor: string
}

export interface Question {
	text: string
	effect: {
		[index: string]: number
	}
}

export const parentLoc = window.location.href.slice(
	0,
	window.location.href.lastIndexOf("/")
)

function getJson(name: string) {
	var request = new XMLHttpRequest()
	request.open("GET", parentLoc + "/" + name + ".json", false)
	request.send(null)
	return JSON.parse(request.responseText)
}

export const axes: Axis[] = getJson("axes")
export const buttons: Button[] = getJson("buttons")
export const questions: Question[] = getJson("questions")
export const general: General = getJson("general")

var maxVals: {
	[index: string]: number
} = {}

for (const axis of axes) {
	maxVals[axis.id] = 0
}

for (const question of questions) {
	for (const axis of axes) {
		maxVals[axis.id] += Math.abs(question.effect[axis.id])
	}
}

export const maxEffects = maxVals
