### mini-webpack
目前只实现了将多个commonjs模块打包成一个js文件，和代码分割异步加载的功能.
主要是作为了解webpack和练手的小东西。

### 基本思路

从`config`文件中拿到入口模块，将入口模块的js源码通过`esprima`转换成一个ast（抽象语法树），然后通过遍历树上的节点定位所有的`require`和`require.ensure`，将所有依赖模块的有用信息收集起来，生成一个依赖树（dependTree），然后通过遍历这个依赖树，生成相应的文件js，其中所有的`require('./a.js')`都会被替换成为`require(1)`的形式，1为模块的唯一id标识。