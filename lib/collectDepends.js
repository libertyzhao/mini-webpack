/**
 * 收集依赖，生成依赖树
 */

const parse = require("./parse.js");
const fs = require("fs");
let target = -1;//chunk的相应id
let depTree = {};
//依赖树，模块id作为key，自己的属性集合作为value

function collectDepends(entryFilePath) {
	let modules
  if (entryFilePath) {
    const entryCode = fs.readFileSync(entryFilePath).toString();
    //将源码转成ast，然后收集相关信息，生成一个modules对象
    modules = parse(entryCode, entryFilePath);
		modules.path = entryFilePath;

    //将收集对象添加到依赖树中
		depTree[modules.id] = modules;
		//收集模块的依赖的依赖。
    collectRequires(modules.requires);
  }
  return depTree;
}

//收集依赖
function collectRequires(statements) {
  if (statements && statements.length > 0) {
    statements.forEach(statement => {
      collectRequireEnsure(statement); //如果是require.ensure模块
			collectRequireEnsureDep(statement); //在require.ensure后面的模块，并且async为true，说明是ensure里面的依赖
      let modules = collectDepends(statement.filename);
    });
  }
}

//require.ensure
function collectRequireEnsure(statement) {
	//require.ensure的模块有chunk属性
  if (statement.chunk) {
		target = statement.id;
    depTree[statement.id] =statement;
  }
}

//require.ensure的依赖
function collectRequireEnsureDep(statement) {
	//require.ensure模块里面依赖的模块有async的属性
	if(statement.async){
		depTree[target].requires.push(statement)
	}
}



module.exports = collectDepends;
