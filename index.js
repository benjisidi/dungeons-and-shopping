require("@babel/register")({ extensions: [".js", ".ts", ".d.ts", ".json"] });

module.exports = require("./server.ts");
