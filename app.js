(function (modules) {
  var installedModules = {};
  function require(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {
      exports: {}
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.ensure = function(chunkId, callback) {
    if (installedModules[chunkId] === 1) return callback(require);
    if (installedModules[chunkId] !== undefined)
      installedModules[chunkId].push(callback);
    else {
      installedModules[chunkId] = [callback];
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = chunkId + ".chunk.js";
      head.appendChild(script);
    }
  };
  window.webpackJsonp = function(chunkId, moreModules) {
    for (var moduleId in moreModules) modules[moduleId] = moreModules[moduleId];
    var callbacks = installedModules[chunkId];
    installedModules[chunkId] = 1;
    for (var i = 0; i < callbacks.length; i++) callbacks[i](require);
  };
  return require(0);
})({0:function(module, exports, require){
		var a = require(1)
a()

require.ensure(2, () => {
  const b = require(3)
  b()
})
const c = require(4)
  c()
require.ensure(5, () => {
  const a = require(1)
  a()
})

	},
	1:function(module, exports, require){
		const c = require('./c.js')
c()
require.ensure([], () => {
  const b = require('./b.js')
  b()
})
function a() {
    console.log('module a function')
  }
  module.exports = a
	},
	4:function(module, exports, require){
		function c() {
  console.log('module c function')
}
module.exports = c
	},
	})