const esprima = require('esprima');
const fs = require('fs');

const code = fs.readFileSync('./src/simple/entry.js').toString();
const ast = esprima.parseScript(code,{
	range:true
});
fs.writeFileSync('./dom.js','var a = '+JSON.stringify(ast));