var a = {
  "/Users/mac/my_project/mini-webpack/src/simple/entry.js": {
    id: 0,
    chunkId: 0,
    async: false,
    requires: [
      {
        name: "./a.js",
        id: 1,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/a.js",
        nameRange: [16, 24]
      },
      {
        name: "./c.js",
        id: 2,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
        nameRange: [48, 56]
      },
      { nameRange: [79, 81], async: true, chunkId: 3, id: 3 },
      {
        name: "./b.js",
        id: 4,
        async: true,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/b.js",
        nameRange: [111, 119],
        chunkId: 3
      },
      {
        name: "./c.js",
        id: 2,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
        nameRange: [147, 155],
        chunkId: 3
      },
      {
        name: "./c.js",
        id: 2,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
        nameRange: [183, 191],
        chunkId: 3
      },
      { nameRange: [217, 224], async: true, chunkId: 5, id: 5 },
      {
        name: "./c.js",
        id: 2,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
        nameRange: [254, 262],
        chunkId: 5
      },
      {
        name: "./a.js",
        id: 1,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/a.js",
        nameRange: [289, 297]
      },
      {
        name: "./a.js",
        id: 1,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/a.js",
        nameRange: [319, 327]
      }
    ],
    source:
      "var a = require('./a.js')\na()\nconst c = require('./c.js')\n  c()\nrequire.ensure([], () => {\n  const b = require('./b.js')\n  b()\n  const c = require('./c.js')\n  c()\n  const c = require('./c.js')\n  c()\n})\nrequire.ensure(['./s'], () => {\n  const c = require('./c.js')\n  c()\n})\nvar e = require('./a.js')\ne()\nvar f = require('./a.js')\nf()",
    filename: "/Users/mac/my_project/mini-webpack/src/simple/entry.js",
    name: "entry.js"
  },
  "/Users/mac/my_project/mini-webpack/src/simple/a.js": {
    id: 1,
    chunkId: 0,
    async: false,
    source:
      "function a() {\n    console.log('module a function')\n  }\n  module.exports = a",
    filename: "/Users/mac/my_project/mini-webpack/src/simple/a.js",
    name: "a.js"
  },
  "/Users/mac/my_project/mini-webpack/src/simple/c.js": {
    id: 2,
    chunkId: 5,
    async: false,
    source:
      "function c() {\n  console.log('module c function')\n}\nmodule.exports = c",
    filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
    name: "c.js"
  },
  "/Users/mac/my_project/mini-webpack/src/simple/b.js": {
    id: 4,
    chunkId: 3,
    async: true,
    requires: [
      {
        name: "./c.js",
        id: 2,
        async: false,
        filename: "/Users/mac/my_project/mini-webpack/src/simple/c.js",
        nameRange: [21, 29]
      }
    ],
    source:
      "\n  const c = require('./c.js')\n  c()\nfunction b() {\n  console.log('module b function')\n}\nmodule.exports = b",
    filename: "/Users/mac/my_project/mini-webpack/src/simple/b.js",
    name: "b.js"
  }
};
