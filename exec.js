const utils = require('./utils.js');
const shell = require('shelljs');
const replace = require('replace-in-file');
let pathToPackage = require('global-modules-path').getPath('git-safe');
let encryption_key;
let mode;
const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);
async function modifySecret(file_path, line) {
  console.log(`filename: ${file_path} | line: ${line}`);
  //open the file

  let target = line.split(/\/\*\s*git-safe\s*\*\//);
  let secretKey = target[1].trim();
  secretKey = trim(secretKey, ';').slice(1, -1);
  console.log('key: ', secretKey);

  let alter_text;
  if (mode === 'decrypt')
    alter_text = utils.getDecryptedText(encryption_key, secretKey);
  else alter_text = utils.getEncryptedText(encryption_key, secretKey);

  target[1] = JSON.stringify(alter_text);
  target = target.join('/* git-safe */');
  const options = {
    files: file_path,
    from: line,
    to: target,
  };
  try {
    const results = await replace(options);
    console.log('Replacement results:', results);
    return target;
  } catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
}
async function revertSecret(file_path, encryptedLine, secretLine) {
  const options = {
    files: file_path,
    from: encryptedLine,
    to: secretLine,
  };

  try {
    const results = await replace(options);
    console.log('Re - Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

const args = process.argv.slice(2);
mode = args.splice(0, 1)[0];
encryption_key = utils.getEncryptionKey(args.splice(0, 1)[0]);
const results = [];
args.forEach((raw_result) => {
  try {
    //assuming that file names will not contain ':' - our separator
    raw_result = raw_result.split(':');
    const file_path = raw_result.splice(0, 2)[0];
    const line = raw_result.join(':');
    results.push({ file_path, line });
  } catch (err) {
    console.log(err);
  }
});

const modifyPromises = [];

results.forEach((entry) => {
  modifyPromises.push(modifySecret(entry.file_path, entry.line));
});

//the output of promise.all is ordered - https://stackoverflow.com/questions/28066429/promise-all-order-of-resolved-values

Promise.all(modifyPromises)
  .then((encryptedLines) => {
    //commit to git

    if (mode === 'commit') {
      //shell.exec(`${pathToPackage}/git.sh`);
      shell.exec('git add .');

      results.forEach((entry, index) => {
        revertSecret(entry.file_path, encryptedLines[index], entry.line);
      });
    }
  })
  .catch(() => {
    process.exit(1);
  });
