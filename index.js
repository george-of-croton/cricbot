var request = require('request');
var fs = require('fs')
var $ = require('cheerio')
var gameObject = function() {
	this.teams = this.toArray();
}

// http://www.cricbuzz.com/live-cricket-scorecard/17356/otg-vs-akl-16th-match-the-ford-trophy-2017
// http://www.cricbuzz.com/live-cricket-scorecard/16670/nz-vs-aus-1st-odi-australia-tour-of-new-zealand-2017
var TeamsObject = function(str) {
	this.teamName = getCountryName(str[0])
	this.players = getPlayers(str)
}
request.get('http://www.cricbuzz.com/live-cricket-scorecard/16670/nz-vs-aus-1st-odi-australia-tour-of-new-zealand-2017', function(req, res, body) {
	var innings = []
	innings.push($('#innings_1', body)
		.children()
		.first()
		.text()
		.split("    "))

	innings.push($('#innings_2', body)
		.children()
		.first()
		.text()
		.split("    "))

	innings.forEach(function(x) {
		var team = new TeamsObject(x)
		// team = JSON.stringify(team)
		console.log(team)
		fs.writeFile(team.teamName + ".json", JSON.stringify(team), function(err) {
			if (err) console.log(err)
			console.log("file written")
		})
	})
})


function getCountryName(str) {
	return str.substring(0, str.indexOf("Innings")).trimLeft().trimRight()
}

function getPlayers(str) {
	var players = []
	var count = 0;
	str.forEach(function(y) {
		if (count !== 0 && count % 2 !== 0 && count < str.length - 2) {
			console.log(count, str.length)
			players.push(new Player(y))
		}
		count++
	})
	return (players)
}


function Player(str) {
	this.playerName = playerName(str)
	this.runs;
	this.status;
}

function playerName(str) {
	var name = str.trimLeft().trimRight()
	if (name[name.length - 1] == ")") {
		name = name.substring(0, name.indexOf('(') - 1)
	}
	return name
}
