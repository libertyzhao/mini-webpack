const findDep = require('./parse.js');
const fs = require('fs');
//依赖树，文件路径作为key，依赖的模块作为value
let depTree = {};

function collectDepends(entryFilePath){
	const entryCode = fs.readFileSync(entryFilePath).toString();
	//将源码转成ast，然后收集相关信息，生成一个modules对象
	let modules = findDep(entryCode, entryFilePath)
	//将收集对象添加到依赖树中
	depTree = Object.assign({},depTree,modules) ;
	// collectRequires(modules.requires)
	return depTree;
}

//收集依赖
function collectRequires(statements){
	if(statements && statements.length > 0){
		statements.forEach(statement => {
			statement.filename && collectDepends(statement.filename);
		})
	}
}

module.exports = collectDepends;