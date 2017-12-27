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