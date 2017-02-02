var request = require('request')
var $ = require("cheerio")

request.get('https://cricbuzz.com', function(req, res, body) {
	console.log($('#match_menu_container', body))
})
