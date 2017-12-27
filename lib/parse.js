const esprima = require("esprima");
const resolve = require('./util.js').resolve;
const path = require('path');
const fs = require('fs');
let pathToInfo = {};//路径对应的用户信息，比如前面的a模块设置了id 1，后面再发现a模块的时候直接根据路径去找对应的id就可以了
let id = 0;//每个id
let chunkId = 0;//app.js的chunkId
let chunks = 0;//代表有多少个chunk
let collectAsync = false;//发现require.ensure，打开异步依赖收集开关
let hash = {};//对chunk内部的requires进行去重
let eventLoop = []

//key可以是path
function findDep(code, key) {

  //给该语法树节点标注信息
  let modules = {
    [chunkId] : {
      id: getValueFromKey(key, "id"),
      chunkId: getValueFromKey(key, "chunkId"),
      // async: getValueFromKey(key, "async"),
      source:code,
      path:key,
      requires:[],
      name:path.basename(key)
    }
  };
  eventLoop.push({modules,key,code,chunkId})
  for(var i = 0 ; i < eventLoop.length ; i++){
    const item = eventLoop[i];
    chunkId = item.chunkId
    parse(item.modules, item.key, item.code);
  }
  return modules;
}

function parse(modules, path, code){
    //转成语法树
    let ast = esprima.parseScript(code, {
      range: true
    });
    analyzeStatements(modules, path, ast.body);
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
 * require只有三个地方能出现
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
  let parentChunkId = chunkId,requireChunkId = chunkId;
  if(collectAsync){//如果正在收集依赖，则当前的chunkID应该是最新的那个
    requireChunkId += chunks;
  }
  hash[requireChunkId] = hash[requireChunkId] || {requires:{}};
  modules[requireChunkId] = modules[requireChunkId] || {requires:[]};
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
      id: getValueFromKey(filePath, "id"),
      // async: getValueFromKey(filePath, "async"),
      filename: filePath,
      chunkId:requireChunkId,
      nameRange: param.range,
      source:code,
    };
    //对requires中的模块进行去重
    // if(!hash[requireChunkId].requires[filePath]){
      modules[requireChunkId].requires.push(params);
    //   hash[requireChunkId].requires[filePath] = 1;
    // }
    if(collectAsync){
      eventLoop.push({modules,key:filePath,code,chunkId:requireChunkId})
    }
    // }else{
    //   parse(params.modules, filePath, code)
    // }
      
  } else if (//require.ensure
    statement.callee &&
    statement.callee.type == "MemberExpression" &&
    statement.callee.object.name === "require" &&
    statement.callee.property.name === "ensure"
  ) {
    const block = statement.arguments[1].body;
    const elements = statement.arguments[0].elements;
    const chunkId = requireChunkId
    //只有发现require.ensure的时候，才会多一个chunk文件，chunkId才会+1
    parentChunkId += ++chunks
    //异步文件依托于require.ensure，而require.ensure依托于代码块，所以只能用chunkId做唯一标识
    let id = getValueFromKey(parentChunkId , "id");
    //将require.ensure添加到父模块中作为依赖
    modules[chunkId].requires.push({
      nameRange: statement.arguments[0].range,
      // async: true,//异步
      chunkId: parentChunkId,
      id: id
    });
    
    //创建require.ensure自己的chunk模块
    modules[parentChunkId] = {
      id:id,
      chunkId:chunkId,
      requires:[],
    }
    
    //开始收集异步依赖，require.ensure([],function(){ xxx }),收集xxx内的require
    if (typeof analyzeStatement[block.type] == "function") {
      collectAsync = true;
      analyzeStatement[block.type](modules, path, block);
      modules[parentChunkId].requires.forEach(item => {
        //require.ensure中的依赖，也应该存在于当前js中，用于替换require(xxx)
        modules[chunkId].requires.push(Object.assign({},item,{async:true}))
      })
      collectAsync = false;
    }
  }
}

function getValueFromKey(path, key) {
  if (!pathToInfo[path]) {
    pathToInfo[path] = {
      id: id++,
      // async: collectAsync,
      chunkId: chunkId
    };
  }
  return pathToInfo[path][key];
}
function setValueFromKey(path,key,value){
  pathToInfo[path][key] = value;
}

module.exports = findDep;
