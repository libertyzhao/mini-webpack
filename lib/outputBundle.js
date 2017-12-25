const fs = require('fs');

function outputBundle(outputPath,bundle){
	Object.keys(bundle).forEach(key => {
		fs.writeFileSync(key,bundle[key]);
	})
	
}

module.exports = outputBundle;