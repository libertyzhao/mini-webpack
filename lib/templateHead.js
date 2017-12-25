let head = function(modules) {
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
};

module.exports = {
  head: `(${head.toString()})`
};
