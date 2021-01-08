const process = require('process')
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

