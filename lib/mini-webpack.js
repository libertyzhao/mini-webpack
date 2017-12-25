/**
 * 1、遍历ast，收集依赖，生成依赖树
 * 2、源码require内的字符串替换成数字
 * 3、将替换后的源码和默认的头部进行拼装
 */

const fs = require('fs');
const path = require('path');
const config = require('../simple.config.js');
const collectDepends = require('./collectDepends.js');
const resolve = require('./resolve.js');
const createBundle = require('./createBundle.js')
const outputBundle = require('./outputBundle.js');


function miniWebpack(config,configPath){

	const configDirname = path.dirname(configPath)
	const entryFilePath = resolve(config.entry,configDirname);

	//收集依赖，生成依赖树
	const depTree = collectDepends(entryFilePath);
	fs.writeFileSync('./dependTree.js','var a = '+JSON.stringify(depTree));

	//生成bundle
	const bundle = createBundle(depTree,config.output.filename);

	//输出bundle
	outputBundle(config.output.filename,bundle);
	
}
miniWebpack(config,'../webpack.config')

module.exports = miniWebpack;