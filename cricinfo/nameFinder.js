function nameFinder(string) {
	var stringToReturn = [];
	for (i = 0; i < string.length; i++) {
		console.log(parseInt(string[i]))
		if (isNaN(parseInt(string[i]))) {
			console.log(stringToReturn)
			stringToReturn.push(string[i])
		}
	}
	return (stringToReturn.join('').trimRight())
}


nameFinder("zealand  234")
