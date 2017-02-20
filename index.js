var request = require('request');
var fs = require('fs')
var $ = require('cheerio')

var currentBatsmen = []
var url = 'http://www.cricbuzz.com/live-cricket-scorecard/16674/nz-vs-rsa-1st-odi-south-africa-tour-of-new-zealand-2017'
var firstCall;

// http://www.cricbuzz.com/live-cricket-scorecard/17356/otg-vs-akl-16th-match-the-ford-trophy-2017
// http://www.cricbuzz.com/live-cricket-scorecard/16670/nz-vs-aus-1st-odi-australia-tour-of-new-zealand-2017


function updateGame(Aurl) {
	request.get(Aurl, function(req, res, body) {
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

		var count = 0;

		innings.forEach(function(x) {
			var team = new TeamsObject(x);
			console.log(team)
			fs.readFile(team.teamName + ".json", 'utf8', function(err, data) {
				if (err) {
					fs.writeFile(team.teamName + ".json", JSON.stringify(team), function(err) {
						if (err) console.log(err)
						console.log("file written")
					})
				} else {
					var teamPrevious = JSON.parse(data)
					teamPrevious.players.forEach(function(x) {
						if (x.status == "not out") {
							team.players.forEach(function(y) {
								if (x.playerName == y.playerName && y.runs - x.runs !== 0 || x.over !== y.over) {
									console.log(y.playerName + runsToWords(y.runs - x.runs))
									console.log(y.over)
									fs.writeFile(team.teamName + ".json", JSON.stringify(team), function(err) {
										if (err) console.log(err)
										console.log("file written")
									})
								} else if (x.playerName == y.playerName && y.runs - x.runs === 0) {
									console.log("no change in score for " + y.playerName, y.over + "'s gone")
								}
							})
						}
					})
				}
			})


		})
	})
}

// setInterval(function() {
updateGame(url)
// }, 6000)
// updateGame(url)




var TeamsObject = function(str) {
	console.log(str)
	this.over = getOvers(str.slice(str.length - 2, str.length))
	this.teamName = getCountryName(str[0])
	this.players = getPlayers(str)
	this.total;
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



function getCountryName(str) {
	return str.substring(0, str.indexOf("Innings")).trimLeft().trimRight()
}


function runsToWords(num) {
	switch (num) {
		case 1:
			return " scored one run"
			break
		case 2:
			return " scored two runs"
			break
		case 3:
			return " scored three runs"
			break
		case 4:
			return " reaches the boundary for four"
			break
		case 5:
			return " scores five runs"
		case 6:
			return " hits it all the way for six!"
			break
		default:
	}
}


function Player(item1, item2) {
	this.playerName = playerName(item1)
	this.runs = getRuns(item2);
	this.balls = getBalls(item2)
	this.status = getStatus(item2);
}

function getStatus(str) {
	var arr = str.split("  ")
	if (arr[0] == "not out") {
		return arr[0]
	} else {
		arr = arr[0].split(" ")
		return causeOfWicket(arr)
	}
}


function causeOfWicket(arr) {
	// console.log(arr)
	switch (arr[0]) {
		case "c":
			return "caught"
			break;
		case "b":
			return "bowled"
			break;
		case "st":
			return "stumped"
			break;
		case "run":
			return arr[0] + " " + arr[1]
			break;
		case "lbw":
			return "LBW"
			break;
		case "":
			arr.shift()
			return causeOfWicket(arr, "this is arr")
			break;
		default:
	}
}

function getRuns(str) {
	var arr = str.split(" ")
	return arr[arr.length - 6]
}



function getBalls(str) {
	var arr = str.split(" ")
	return arr[arr.length - 5]
}

function getOvers(str) {
	var arr = []
	var result
	str.forEach(function(x) {
		arr.push(x.split("  "))
	})
	arr.forEach(function(x) {
		if (x[0] === "Extras") {
			result = x[x.length - 1].split(" ")
			// console.log(parseFloat(result[result.length - 2]))
			result = parseFloat(result[result.length - 2])
		}
	})
	return result
}



function playerName(str) {
	var name = str.trimLeft().trimRight()
	if (name[name.length - 1] == ")") {
		name = name.substring(0, name.indexOf('(') - 1)
	}
	return name
}
