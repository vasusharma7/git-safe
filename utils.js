const crypto = require('crypto');
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

function getEncryptedText(encryption_key, plain_text) {
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

  let encrypted_text = cipher.update(plain_text, 'utf8', 'hex');
  encrypted_text += cipher.final('hex');
  console.log('encrypted text:', encrypted_text);
  return encrypted_text;
}
function getDecryptedText(encryption_key, encrypted_text) {
  try {
    console.log("decrypting...");
    let iv;

    iv = Buffer.alloc(16, 1);

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryption_key), iv);

    let decrypted = decipher.update(Buffer.from(encrypted_text, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch(err) {
    console.log(err);
  }
}

module.exports = { getEncryptedText, getEncryptionKey, getDecryptedText };
