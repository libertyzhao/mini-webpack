const parse = require('./parse.js');
const path = require('path');
const fs = require('fs');
//依赖树，文件路径作为key，依赖的模块作为value
const depTree = {};

function collectDepends(entryFilePath){
	const entryCode = fs.readFileSync(entryFilePath).toString();
	//将源码转成ast，然后收集相关信息，生成一个modules对象
	let modules = parse(entryCode, entryFilePath)
	modules.source = entryCode;
	modules.filename = entryFilePath;
	modules.name = path.basename(entryFilePath)
	//将收集对象添加到依赖树中
	depTree[modules.filename] = modules;
	collectRequires(modules.requires)
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