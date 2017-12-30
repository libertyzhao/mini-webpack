//用它来生成ast语法树（dom.js），方便分析

const esprima = require('esprima');
const fs = require('fs');

const code = fs.readFileSync('./src/entry.js').toString();
const ast = esprima.parseScript(code,{
	range:true
});
fs.writeFileSync('./dom.js','var a = '+JSON.stringify(ast));