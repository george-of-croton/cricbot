var request = require('request')
var fs = require('fs')

var teams = []

request.get('http://static.cricinfo.com/rss/livescores.xml', function(req, res, body) {
	var matches = body.split('<title>')
	var sides;
	var match;
	matches.forEach(function(x) {
		if (x[0] == "N" && x[2] == "w") {
			console.log(x)
			match = x.substring(0, x.indexOf('</title>'))
			sides = match.split(' v ')
			console.log(sides)
		}
	})
	var count = 1;
	sides.forEach(function(x) {
		console.log(sides)
		var team = new Team(x)
		// console.log(team)
		teams.push(team)
		console.log(teams)
	})

	function Team(side) {
		this.teamName = nameFinder(side)
		if (side[side.length - 1] === "*") {
			this.batting = true;
		} else {
			this.batting = false
		}
		var score = side.substring(side.indexOf("/") - 3, side.indexOf("/") + 2)
			.split('/')
		this.runs = score[0].trimLeft()
		this.wicketsInHand = 10 - score[score.length - 1]
	}
})



function nameFinder(string) {
	var stringToReturn = [];
	for (i = 0; i < string.length; i++) {
		if (isNaN(parseInt(string[i])) && string[i] !== '/' && string[i] !== '*') {
			stringToReturn.push(string[i])
		}
	}
	return (stringToReturn.join('').trimRight())
}
