const esprima = require("esprima");
const resolve = require("./resolve");
let pathToInfo = {};//路径对应的用户信息
let id = 0;//每个id
let chunkId = 0;//文件id，代表chunk
//发现require.ensure，打开异步依赖收集开关
let collectAsync = false;

function parse(code, path) {
  //转成语法树
  let ast = esprima.parseScript(code, {
    range: true
  });
  //给该语法树节点标注信息
  let modules = {
    id: getValueFromKey(path, "id"),
    chunkId: getValueFromKey(path, "chunkId"),
    async: getValueFromKey(path, "async")
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
  //require
  if (statement.callee && statement.callee.name == "require") {
    modules.requires = modules.requires || [];
    //require('./abc.js'); 中的参数节点
    const param = statement.arguments[0];
    //拿到./abc.js模块的绝对路径
    const filePath = resolve(param.value, path);
    //将require引入的模块的信息收集起来
    let params = {
      name: param.value,
      id: getValueFromKey(filePath, "id"),
      async: getValueFromKey(filePath, "async"),
      filename: filePath,
      nameRange: param.range
    };
    //如果异步开关开启的情况下，说明是require.ensure中的模块
    if(collectAsync){
      //require.ensure中被require进来的模块应该被标注上对应chunk的chunkId
      params.chunkId = chunkId;
      //并且将chunkId保存到单例对象上，供后面对象收集
      setValueFromKey(filePath, "chunkId",chunkId)
    }
    //require.ensure内的require的async应该为false
    modules.async && (params.async = false);
    modules.requires.push(params);
  } else if (//require.ensure
    statement.callee &&
    statement.callee.type == "MemberExpression" &&
    statement.callee.object.name === "require" &&
    statement.callee.property.name === "ensure"
  ) {
    const block = statement.arguments[1].body;
    const elements = statement.arguments[0].elements;

    modules.requires = modules.requires || [];
    //只有发现require.ensure的时候，才会多一个chunk文件，chunkId才会+1
    let id = getValueFromKey(++chunkId, "id");
    modules.requires.push({
      nameRange: statement.arguments[0].range,
      async: true,//异步
      chunkId: id,
      id: id
    });
    //开始收集异步依赖，require.ensure([],function(){ xxx }),收集xxx内的require
    if (typeof analyzeStatement[block.type] == "function") {
      let a = chunkId;
      collectAsync = true;
      chunkId = id;//将全局chunkId替换为当前require.ensure的chunkId，给xxx内require模块做归属标识
      analyzeStatement[block.type](modules, path, block);
      chunkId = a;//还原
      collectAsync = false;
    }
  }
}

function getValueFromKey(path, key) {
  if (!pathToInfo[path]) {
    pathToInfo[path] = {
      id: id++,
      async: collectAsync,
      chunkId: chunkId
    };
  }
  return pathToInfo[path][key];
}
function setValueFromKey(path,key,value){
  pathToInfo[path][key] = value;
}

module.exports = parse;
