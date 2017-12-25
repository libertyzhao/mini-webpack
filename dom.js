var a = {
  type: "Program",
  body: [
    {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          id: { type: "Identifier", name: "a", range: [4, 5] },
          init: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "require", range: [8, 15] },
            arguments: [
              {
                type: "Literal",
                value: "./a.js",
                raw: "'./a.js'",
                range: [16, 24]
              }
            ],
            range: [8, 25]
          },
          range: [4, 25]
        }
      ],
      kind: "var",
      range: [0, 25]
    },
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "a", range: [26, 27] },
        arguments: [],
        range: [26, 29]
      },
      range: [26, 29]
    },
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: {
          type: "MemberExpression",
          computed: false,
          object: { type: "Identifier", name: "require", range: [30, 37] },
          property: { type: "Identifier", name: "ensure", range: [38, 44] },
          range: [30, 44]
        },
        arguments: [
          { type: "ArrayExpression", elements: [], range: [45, 47] },
          {
            type: "ArrowFunctionExpression",
            id: null,
            params: [],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "b", range: [65, 66] },
                      init: {
                        type: "CallExpression",
                        callee: {
                          type: "Identifier",
                          name: "require",
                          range: [69, 76]
                        },
                        arguments: [
                          {
                            type: "Literal",
                            value: "./b.js",
                            raw: "'./b.js'",
                            range: [77, 85]
                          }
                        ],
                        range: [69, 86]
                      },
                      range: [65, 86]
                    }
                  ],
                  kind: "const",
                  range: [59, 86]
                },
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: { type: "Identifier", name: "b", range: [89, 90] },
                    arguments: [],
                    range: [89, 92]
                  },
                  range: [89, 92]
                }
              ],
              range: [55, 94]
            },
            generator: false,
            expression: false,
            async: false,
            range: [49, 94]
          }
        ],
        range: [30, 95]
      },
      range: [30, 95]
    },
    {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          id: { type: "Identifier", name: "e", range: [100, 101] },
          init: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "require", range: [104, 111] },
            arguments: [
              {
                type: "Literal",
                value: "./a.js",
                raw: "'./a.js'",
                range: [112, 120]
              }
            ],
            range: [104, 121]
          },
          range: [100, 121]
        }
      ],
      kind: "var",
      range: [96, 121]
    },
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "e", range: [122, 123] },
        arguments: [],
        range: [122, 125]
      },
      range: [122, 125]
    },
    {
      type: "VariableDeclaration",
      declarations: [
        {
          type: "VariableDeclarator",
          id: { type: "Identifier", name: "f", range: [130, 131] },
          init: {
            type: "CallExpression",
            callee: { type: "Identifier", name: "require", range: [134, 141] },
            arguments: [
              {
                type: "Literal",
                value: "./a.js",
                raw: "'./a.js'",
                range: [142, 150]
              }
            ],
            range: [134, 151]
          },
          range: [130, 151]
        }
      ],
      kind: "var",
      range: [126, 151]
    },
    {
      type: "ExpressionStatement",
      expression: {
        type: "CallExpression",
        callee: { type: "Identifier", name: "f", range: [152, 153] },
        arguments: [],
        range: [152, 155]
      },
      range: [152, 155]
    }
  ],
  sourceType: "script",
  range: [0, 155]
};
