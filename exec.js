const process = require('process')
const crypto = require('crypto')

let encryption_key;
const algorithm = 'aes-192-cbc';

function getEncryptionKey(password) {
  try {
    // generate the 24 byte key required
    const key = crypto.scryptSync(password , 'salt', 24);
    return key;

  } catch(err) {
    console.log("Error while creating key");
    console.log(err);
    process.exit(1);
  }
}

function modifySecret(file_name, line_no) {
  console.log(`filename: ${file_name} | line: ${line_no}`);
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

  //open the file

  // get the text to be encrypted

  // encrypt the text
      // create the cipher
  const cipher = crypto.createCipheriv(algorithm, encryption_key, iv);

  let encrypted_text = cipher.update('text_to_be_encrypted', 'utf8', 'hex');
  encrypted_text += cipher.final('hex');
  console.log(encrypted_text);

  // save the encrypted text at the appropriate location
}

const modifySecretHandler = (raw_results) => {
  try {
    const file_name = raw_results.split(":")[0];
    const line_no = raw_results.split(":")[1];
    modifySecret(file_name, line_no);
  } catch(err) {
    console.log(err);
  }
  //modifySecret(filename, 
}

process.argv.forEach(function (val, index, array) {
  if(index < 2) {
    return;
  }
  if(index == 2) {
    encryption_key=getEncryptionKey(val);
    return;
  }
  modifySecretHandler(val);
});

