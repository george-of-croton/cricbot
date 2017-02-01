var request = require('request');
var fs = require('fs')
var $ = require('cheerio')
var gameObject = function() {
	this.teams = this.toArray();
}

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
		console.log(team)
		// x.splice(0, x.length - 1, getNames(innings[x]))
	})
})

// Martin Guptill    b M Stoinis

function getCountryName(str) {
	return str.substring(0, str.indexOf("Innings")).trimLeft().trimLeft()
}

function getPlayers(str) {
	var players = []
	var count = 0;
	str.forEach(function(y) {
		if (count !== 0 && count % 2 !== 0 && count < str.length - 1) {
			console.log(count, str.length)
			players.push(new Player(y))
		}
		count++
	})
	return (players)
}


function Player(str) {
	this.playerName = str.trimLeft().trimRight()
	this.runs;
	this.status;
}
// var thing = $('.row brief-summary').children().length


// fs.writeFile('bs.js', thing, function(err) {
// 	if (err) {
// 		"fuck your mother"
// 	}
// 	console.log("Thou file twas writ")
// })
