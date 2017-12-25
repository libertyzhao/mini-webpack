webpackJsonp(3, {
  4: function(module, exports, require) {
    const c = require(2);
    c();
    function b() {
      console.log("module b function");
    }
    module.exports = b;
  },
  2: function(module, exports, require) {
    function c() {
      console.log("module c function");
    }
    module.exports = c;
  }
});
