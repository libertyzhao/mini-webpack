webpackJsonp(5,{1:function(module, exports, require){
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