var request = require('request');
var fs = require('fs')
var $ = require('cheerio')


// http://www.cricbuzz.com/live-cricket-scorecard/17356/otg-vs-akl-16th-match-the-ford-trophy-2017
// http://www.cricbuzz.com/live-cricket-scorecard/16670/nz-vs-aus-1st-odi-australia-tour-of-new-zealand-2017

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
		var team = new TeamsObject(x);
		console.log(team)
		fs.writeFile(team.teamName + ".json", JSON.stringify(team), function(err) {
			if (err) console.log(err)
			console.log("file written")
		})
	})
})


var TeamsObject = function(str) {
	console.log(str, "this is str being passed to TeamsObject()")
	this.teamName = getCountryName(str[0])
	this.players = getPlayers(str)
}

function getCountryName(str) {
	return str.substring(0, str.indexOf("Innings")).trimLeft().trimRight()
}

function getPlayers(str) {
	var players = []
	var count = 0;
	var prevItem;
	str.forEach(function(y) {
		if (count !== 0 && count % 2 !== 0 && count < str.length - 1) {
			prevItem = y
		}
		if (count !== 0 && count % 2 === 0 && count < str.length - 1) {
			players.push(new Player(prevItem, y))
		}
		count++
	})
	return (players)
}


function Player(item1, item2) {
	this.playerName = playerName(item1)
	this.runs = getRuns(item2);
	this.balls = getBalls(item2)
	this.status;
}

function getRuns(str) {
	var arr = str.split(" ")
	return arr[arr.length - 6]
}

function getBalls(str) {
	var arr = str.split(" ")
	return arr[arr.length - 5]
}

function playerName(str) {
	var name = str.trimLeft().trimRight()
	if (name[name.length - 1] == ")") {
		name = name.substring(0, name.indexOf('(') - 1)
	}
	return name
}
