const template = require('./templateHead');
const ext = '.chunk.js';
// let repeat = {}//防止重复打包

function createBundle(depTree,path){
	let bundle = {}, keyArray = [];
	//遍历依赖树，将模块的主体代码组装起来
	Object.keys(depTree).forEach(filePath => {
		let statement = depTree[filePath];
		if(!statement || statement.continue)return ;
		let key  = statement.chunkId+ext;//文件名作为key
		keyArray.push(key);//收集顺序

		if(!statement.async){//一般只有一个入口，就是那个async为false的第一个模块，入口模块
			key = path;
		}else {
			// repeat[filePath+key] = 1;
		}
		bundle[key] = bundle[key] || '';
		bundle[key] += addCode(statement,key);//将该模块的源码添加进来
		bundle[key] += addDepends(statement,depTree,key) ;//将运行在该模块上的require那些文件加载进来 
	})
	//去重之后，按顺序给bundle加入头尾的代码模板 
	addHeadFooter(bundle,keyArray,path)
	return bundle;
}

//将code注入到要生成的源码中
function addCode(statement,key){
	// if(repeat[statement.id+key]){
	// 	return ;
	// }
	// repeat[statement.id+key] = 1;
	 return `${statement.id}:function(module, exports, require){
		${replaceFileNameToId(statement.source,statement)}
	},
	`
}

//将依赖的模块的代码添加到统一的chunk中
function addDepends(statement,depTree,key){
	let chunk = '';
	if(statement.requires){
		statement.requires.forEach(mod =>{
			if(!mod.async && depTree[mod.filename]){
				chunk += addCode(depTree[mod.filename],key);
				// if(!depTree[mod.filename].async){//自己是异步的就不删
				// 	delete depTree[mod.filename];
				// }
				depTree[mod.filename].continue = true;
			}
		});
	}
	return chunk;
}

//将源码中的require('./b.js')替换成require(2)
function replaceFileNameToId(code,statement){
	let requires = statement.requires;
	if(requires){
		code = code.split('');
		for(let i = requires.length - 1 ; i >= 0 ; i-- ){
			updateCode(code,requires,i)
		}
		code =  code.join('');
	}
	return code;
}

//替换源码
function updateCode(code,requires,i){
	let nameRange = requires[i].nameRange,
			start = nameRange[0],
			end = nameRange[1];
	code.splice(start,end - start,requires[i].id);
}

//给源码添加首尾
function addHeadFooter(bundle,keyArray,path){
	keyArray.forEach((key, index) => {
		if(index == 0){
			bundle[path] = template.head + '({' + bundle[path] + '})'
		}else {
			let chunkId = key.split(ext)[0];
			bundle[key] = `webpackJsonp(${chunkId},{` + bundle[key] + '})'
		}
	})
}

module.exports = createBundle;