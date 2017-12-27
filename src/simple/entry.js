var a = require('./a.js')
a()

require.ensure([], () => {
  const b = require('./b.js')
  b()
})
const c = require('./c.js')
  c()
require.ensure(['./s'], () => {
  const a = require('./a.js')
  a()
})
