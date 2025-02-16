const fs = require("fs");

const template = fs.readFileSync(__dirname + "/lsw-table.html").toString();
const component = fs.readFileSync(__dirname + "/lsw-table.js").toString();
const compiledComponent = component.replace("$template", template);

fs.writeFileSync(__dirname + "/lsw-table.compiled.js", compiledComponent, "utf8");
