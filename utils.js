const crypto = require("crypto");
const process = require("process");
var glob = require('glob');
const fs = require('fs');
const readline = require('readline');

const algorithm = "aes-192-cbc";

function getEncryptionKey(password) {
  try {
    // generate the 24 byte key required
    const key = crypto.scryptSync(password, "salt", 24);
    return key;
  } catch (err) {
    console.log("Error while creating key");
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

  let encrypted_text = cipher.update(plain_text, "utf8", "hex");
  encrypted_text += cipher.final("hex");
  console.log("encrypted text:", encrypted_text);
  return encrypted_text;
}
function getDecryptedText(encryption_key, encrypted_text) {
  try {
    console.log("decrypting...");
    let iv;

    iv = Buffer.alloc(16, 1);

    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(encryption_key),
      iv
    );

    let decrypted = decipher.update(Buffer.from(encrypted_text, "hex"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    console.log("decrypted text:", decrypted.toString());
    return decrypted.toString();
  } catch (err) {
    if (err.code === "ERR_OSSL_EVP_BAD_DECRYPT") process.exit(2);
    else if (err.code === "ERR_OSSL_EVP_WRONG_FINAL_BLOCK_LENGTH")
      process.exit(3);
    else exit(0);
  }
}

/**
 * This function returns all the file which are part of ".gitsafe" file which is located at root of repository 
 * @returns Array of files part of .gitsafe
 */
function getFilesFromGitSafe() {
  // find a way to get location of .gitsafe
  let gitSafeFilePath = process.env.basepath
  const fileStream = fs.createReadStream(gitSafeFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let filesArray = []

  for (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    glob(line, function(err, files){
      filesArray.concat(files)
    });
  }

  return filesArray
}

module.exports = { getEncryptedText, getEncryptionKey, getDecryptedText, getFilesFromGitSafe };
