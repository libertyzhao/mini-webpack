/**
 * 对ast进行分析，记录文件模块的属性
 */

const esprima = require("esprima");
const resolve = require("./util.js").resolve;
const path = require("path");
const fs = require("fs");
let collectAsync = false; //发现require.ensure，打开异步依赖收集开关
let id = 0;
let pathToInfo = {};//路径对应id，唯一的

function parse(code, path) {
  //转成语法树
  let ast = esprima.parseScript(code, {
    range: true
  });
  //给该语法树节点标注信息
  let modules = {
    source: code,
    id: getIdByPath(path)
  };
  analyzeStatements(modules, path, ast.body);
  return modules;
}

//遍历ast
function analyzeStatements(modules, path, astTree) {
  astTree.forEach(statement => {
    const func = analyzeStatement[statement.type];
    if (typeof func == "function") {
      func(modules, path, statement);
    }
  });
}

/**
 * require只有四个地方能出现
 * 1、代码块中
 * 2、变量声明
 * 3、变量赋值
 * 4、调用require函数的地方
 */
var analyzeStatement = {
  BlockStatement: (modules, path, statement) => {
    //代码块中查找require
    analyzeStatements(modules, path, statement.body);
  },
  VariableDeclaration: (modules, path, statement) => {
    //变量声明中查找require
    analyzeVariableDeclarations(modules, path, statement.declarations);
  },
  ExpressionStatement: (modules, path, statement) => {
    //变量赋值中查找require
    const func = analyzeStatement[statement.expression.type];
    if (typeof func == "function") {
      func(modules, path, statement.expression);
    }
  },
  CallExpression: (modules, path, statement) => {
    //调用require函数的地方
    analyzeCallExpression(modules, path, statement);
  }
};

//变量声明
function analyzeVariableDeclarations(modules, path, statements) {
  statements.forEach(node => {
    if (
      node.type == "VariableDeclarator" &&
      typeof analyzeStatement[node.init.type] == "function"
    ) {
      analyzeStatement[node.init.type](modules, path, node.init);
    }
  });
}

//将该依赖的信息添加到依赖树中
function analyzeCallExpression(modules, path, statement) {

  modules.requires = modules.requires || [];
  //require
  if (statement.callee && statement.callee.name == "require") {
    //require('./abc.js'); 中的参数节点
    const param = statement.arguments[0];
    //拿到./abc.js模块的绝对路径
    const filePath = resolve(param.value, path);
    const code = fs.readFileSync(filePath).toString();
    //将require引入的模块的信息收集起来
    let params = {
      name: param.value,
      filename: filePath,
      source:code,
      nameRange: param.range,
      id:getIdByPath(filePath)
    };
    //如果require.ensure里面收集依赖的开关打开了，这个模块为该ensure的依赖。
    if(collectAsync){
      params.async = true;
    }
    modules.requires.push(params);

  } else if (
    //require.ensure
    statement.callee &&
    statement.callee.type == "MemberExpression" &&
    statement.callee.object.name === "require" &&
    statement.callee.property.name === "ensure"
  ) {
    const block = statement.arguments[1].body;
    const elements = statement.arguments[0].elements;

    modules.requires.push({
      nameRange: statement.arguments[0].range,
      chunk:true,
      id:id++,
      requires:[],
    });

    //开始收集异步依赖，require.ensure([],function(){ xxx }),收集xxx内的require
    if (typeof analyzeStatement[block.type] == "function") {
      collectAsync = true;//打开开关
      analyzeStatement[block.type](modules, path, block);
      collectAsync = false;
    }
  }
}

function getIdByPath(path){
	pathToInfo[path] = pathToInfo[path] || { id: id++ };
	return pathToInfo[path].id;
}

module.exports = parse;
