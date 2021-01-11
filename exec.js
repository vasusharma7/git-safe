const process = require('process')
process.argv.forEach(function (val, index, array) {
  if(index < 2) {
    return;
  }
  console.log(index + ': ' + val);
});

