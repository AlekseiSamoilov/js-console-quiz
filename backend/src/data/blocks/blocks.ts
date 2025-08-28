import { IBlocksData } from '../../types';

export const blocksData: IBlocksData = {
    blocks: {
        variables: [
            {
                id: "var1",
                code: "let a = 5;\nconsole.log(a);",
                dependencies: [],
                provides: ["a"],
                consoleOutput: ["5"]
            },
            {
                id: "var2",
                code: "let b = 10;\nconsole.log(b);",
                dependencies: [],
                provides: ["b"],
                consoleOutput: ["10"]
            },
            {
                id: "var3",
                code: "let c = a + b;\nconsole.log(c);",
                dependencies: ["a", "b"],
                provides: ["c"],
                consoleOutput: ["15"]
            },
            {
                id: "var4",
                code: "let x = 20;\nlet y = 30;\nconsole.log(x, y);",
                dependencies: [],
                provides: ["x", "y"],
                consoleOutput: ["20 30"]
            },
            {
                id: "var5",
                code: "let str = 'Hello';\nlet num = 42;\nconsole.log(str, num);",
                dependencies: [],
                provides: ["str", "num"],
                consoleOutput: ["Hello 42"]
            }
        ],
        reassignments: [
            {
                id: "reassign1",
                code: "a = 7;\nconsole.log(a);",
                dependencies: ["a"],
                provides: [],
                consoleOutput: ["7"]
            },
            {
                id: "reassign2",
                code: "b = a * 2;\nconsole.log(b);",
                dependencies: ["a", "b"],
                provides: [],
                consoleOutput: ["14"]
            },
            {
                id: "reassign3",
                code: "x = x + 10;\nconsole.log(x);",
                dependencies: ["x"],
                provides: [],
                consoleOutput: ["30"]
            },
            {
                id: "reassign4",
                code: "str = str + ' World';\nconsole.log(str);",
                dependencies: ["str"],
                provides: [],
                consoleOutput: ["Hello World"]
            }
        ],
        timers: [
            {
                id: "timer1",
                code: "setTimeout(() => {\n  console.log('timeout');\n}, 0);",
                dependencies: [],
                provides: [],
                consoleOutput: [],
                asyncOutput: ["timeout"],
                async: true
            },
            {
                id: "timer2",
                code: "setTimeout(() => {\n  a = a * 2;\n  console.log(a);\n}, 0);",
                dependencies: ["a"],
                provides: [],
                consoleOutput: [],
                asyncOutput: ["14"],
                async: true
            },
            {
                id: "timer3",
                code: "setTimeout(() => {\n  console.log(x + y);\n}, 0);",
                dependencies: ["x", "y"],
                provides: [],
                consoleOutput: [],
                asyncOutput: ["50"],
                async: true
            }
        ],
        promises: [
            {
                id: "promise1",
                code: "Promise.resolve().then(() => {\n  console.log('promise');\n});",
                dependencies: [],
                provides: [],
                consoleOutput: [],
                asyncOutput: ["promise"],
                async: true,
                priority: 1
            },
            {
                id: "promise2",
                code: "Promise.resolve().then(() => {\n  b = b + 5;\n  console.log(b);\n});",
                dependencies: ["b"],
                provides: [],
                consoleOutput: [],
                asyncOutput: ["15"],
                async: true,
                priority: 1
            }
        ],
        loops: [
            {
                id: "loop1",
                code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
                dependencies: [],
                provides: [],
                consoleOutput: ["0", "1", "2"]
            },
            {
                id: "loop2",
                code: "let i = 0;\nwhile (i < 2) {\n  console.log(`while ${i}`);\n  i++;\n}",
                dependencies: [],
                provides: ["i"],
                consoleOutput: ["while 0", "while 1"]
            },
            {
                id: "loop3",
                code: "let sum = 0;\nfor (let i = 1; i <= 3; i++) {\n  sum += i;\n  console.log(`sum: ${sum}`);\n}",
                dependencies: [],
                provides: ["sum"],
                consoleOutput: ["sum: 1", "sum: 3", "sum: 6"]
            }
        ],
        conditionals: [
            {
                id: "if1",
                code: "if (a > 5) {\n  console.log('a > 5');\n} else {\n  console.log('a <= 5');\n}",
                dependencies: ["a"],
                provides: [],
                consoleOutput: ["a > 5"]
            },
            {
                id: "if2",
                code: "if (b === 10) {\n  console.log('b is 10');\n} else {\n  console.log('b is not 10');\n}",
                dependencies: ["b"],
                provides: [],
                consoleOutput: ["b is not 10"]
            },
            {
                id: "if3",
                code: "let result = x > y ? 'x is bigger' : 'y is bigger';\nconsole.log(result);",
                dependencies: ["x", "y"],
                provides: ["result"],
                consoleOutput: ["y is bigger"]
            }
        ]
    },
    complexityLevels: {
        easy: {
            blockCount: { min: 2, max: 3 },
            types: ["variables", "reassignments"]
        },
        medium: {
            blockCount: { min: 3, max: 5 },
            types: ["variables", "reassignments", "loops", "conditionals"]
        },
        hard: {
            blockCount: { min: 4, max: 6 },
            types: ["variables", "reassignments", "loops", "conditionals", "timers", "promises"]
        }
    }
};