const crypto = require('crypto');
const process = require('process');
const shell = require('shelljs');
const fs = require('fs');
const readline = require('readline');
const replace = require('replace-in-file');
let encryption_key;
const algorithm = 'aes-192-cbc';

function getEncryptionKey(password) {
  try {
    // generate the 24 byte key required
    const key = crypto.scryptSync(password, 'salt', 24);
    return key;
  } catch (err) {
    console.log('Error while creating key');
    console.log(err);
    process.exit(1);
  }
}

function getEncryptedText(plain_text) {
  let iv;

  // Use a common iv for now
  /*
  try {
    // generate the initial vector required
    iv = crypto.randomFillSync(new Uint8Array(16));
  } catch(err) {
    console.log("Error generating IV");
    console.log(err);
  }
  */
  iv = Buffer.alloc(16, 1);

  const cipher = crypto.createCipheriv(algorithm, encryption_key, iv);

  let encrypted_text = cipher.update('text_to_be_encrypted', 'utf8', 'hex');
  encrypted_text += cipher.final('hex');
  console.log('encrypted text:', encrypted_text);
  return encrypted_text;
}

async function modifySecret(file_path, line) {
  console.log(`filename: ${file_path} | line: ${line}`);
  //open the file

  const trim = (str, chars) => str.split(chars).filter(Boolean).join(chars);
  let target = line.split(/\/\*[ ]git-safe[ ]\*\//);
  let secretKey = target[1].trim();
  secretKey = trim(secretKey, ';').slice(1, -1);
  console.log('key: ', secretKey);
  const encrypted_text = getEncryptedText();

  target[1] = JSON.stringify(encrypted_text);
  target = target.join(' /* git-safe */ ');
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
  // get the text to be encrypted

  // encrypt the text
  // create the cipher

  // save the encrypted text at the appropriate location
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
//const modifySecretHandler = (raw_results) => {
//
//  try {
//    //assuming that file names will not contain ':' - our separator
//    raw_results = raw_results.split(':');
//    const file_path = raw_results.splice(0, 2)[0];
//    const line = raw_results.join(':');
//    modifySecret(file_path, line);
//  } catch (err) {
//    console.log(err);
//  }
//};

const args = process.argv.slice(2);
encryption_key = getEncryptionKey(args.splice(0, 1)[0]);
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
    shell.exec('./git.sh');

    //console.log(encryptedLines);
    results.forEach((entry, index) => {
      revertSecret(entry.file_path, encryptedLines[index], entry.line);
    });
  })
  .catch(() => {
    process.exit(1);
  });

//process.argv.forEach(function (val, index, array) {
//  if (index < 2) {
//    return;
//  }
//  if (index == 2) {
//    encryption_key = getEncryptionKey(val);
//    return;
//  }
//
//  modifySecretHandler(val);
//});
//
