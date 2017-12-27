const path = require("path");

function resolve(modulePath, filePath) {
	return path.resolve(path.dirname(filePath), modulePath)
	// return path.resolve(filePath,)
}

function filter(){
	
}

module.exports = {
	resolve:resolve,
	filter:filter
}