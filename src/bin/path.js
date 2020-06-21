const path = require("path");

const uri = path.resolve("windows-10-vm.windows-10-privat.shared/leckmich");
const variable = path.resolve(uri, 'variables', 'affe.json');

console.log(uri);
console.log(path.relative(variable, uri));
