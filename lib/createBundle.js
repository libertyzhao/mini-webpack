const template = require('./templateHead');
const ext = '.chunk.js';
// let repeat = {}//防止重复打包

function createBundle(depTree,path){
	let bundle = {}, keyArray = [];
	//遍历依赖树，将模块的主体代码组装起来
	Object.keys(depTree).forEach(chunkId => {
		let statement = depTree[chunkId];
		// if(!statement || statement.continue)return ;
		let key  = statement.id + ext;//文件名作为key
		if(statement.id == '0'){
			key = path;
		}

		bundle[key] = bundle[key] || '';
		bundle[key] += addCode(statement,key);//将该模块的源码添加进来
		bundle[key] += addDepends(statement,key) ;//将运行在该模块上的require那些文件加载进来 
	})
	//去重之后，按顺序给bundle加入头尾的代码模板 
	addHeadFooter(bundle,path)
	return bundle;
}

//将code注入到要生成的源码中
function addCode(statement){
	// if(repeat[statement.id+key]){
	// 	return ;
	// }
	// repeat[statement.id+key] = 1;
	if(!statement.source) return '';
	 return `${statement.id}:function(module, exports, require){
		${replaceFileNameToId(statement.source,statement)}
	},
	`
}

//将依赖的模块的代码添加到统一的chunk中
function addDepends(statement,key){
	let chunk = '';
	if(statement.requires){
		statement.requires.forEach(item =>{
			// if(!mod.async && depTree[mod.filename]){
				if(!item.async){
					chunk += addCode(item);
				}
				
				// if(!depTree[mod.filename].async){//自己是异步的就不删
				// 	delete depTree[mod.filename];
				// }
				// depTree[mod.filename].continue = true;
			// }
		});
	}
	return chunk;
}

//将源码中的require('./b.js')替换成require(2)
function replaceFileNameToId(code,statement){
	let requires = statement.requires;
	
		code = code.split('');
		if(requires){
			for(let i = requires.length - 1 ; i >= 0 ; i-- ){
				updateCode(code,requires[i])
			}
		}
		// if(statement.nameRange){
		// 	updateCode(code,statement)
		// }
		code =  code.join('');
	
	return code;
}

//替换源码
function updateCode(code,item){
	// console.log(item);
	let nameRange = item.nameRange,
			start = nameRange[0],
			end = nameRange[1];
	code.splice(start,end - start,item.id);
}

//给源码添加首尾
function addHeadFooter(bundle,path){
	Object.keys(bundle).forEach(chunkId => {
		if(chunkId == path){
			bundle[chunkId] = template.head + '({' + bundle[chunkId] + '})'
		}else {
			let key = chunkId.split(ext)[0];
			bundle[chunkId] = `webpackJsonp(${key},{` + bundle[chunkId] + '})'
		}
		// console.log(bundle)
	})
}

module.exports = createBundle;