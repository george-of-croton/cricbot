var request = require('request');
var fs = require('fs')
var $ = require('cheerio')

request.get('http://www.cricbuzz.com/live-cricket-scorecard/16670/nz-vs-aus-1st-odi-australia-tour-of-new-zealand-2017', function(req, res, body) {
	var innings = []
	innings.push($('#innings_1', body).children().first().text())

	innings.push($('#innings_2', body).children().first().text())

	// console.log(getName(innings[0]))
	console.log(getNames(innings[0]))
})

function getNames(string) {
	return string.split("    ")
}

// Martin Guptill    b M Stoinis

function getCountryName(string) {
	return string.substring(0, string.indexOf("Innings")).trimLeft().trimLeft()
}
// var thing = $('.row brief-summary').children().length


// fs.writeFile('bs.js', thing, function(err) {
// 	if (err) {
// 		"fuck your mother"
// 	}
// 	console.log("Thou file twas writ")
// })
