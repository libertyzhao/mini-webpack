/**
 * 查找模块的绝对路径
 */

const path = require("path");

module.exports = function(modulePath, filePath) {
  return path.resolve(path.dirname(filePath), modulePath)
  // return path.resolve(filePath,)
};
