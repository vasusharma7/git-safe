const crypto = require('crypto')
const process = require('process')
const fs = require('fs')
const readline = require('readline')
let encryption_key
const algorithm = 'aes-192-cbc'

function getEncryptionKey(password) {
  try {
    // generate the 24 byte key required
    const key = crypto.scryptSync(password, 'salt', 24)
    return key
  } catch (err) {
    console.log('Error while creating key')
    console.log(err)
    process.exit(1)
  }
}

function getEncryptedText(plain_text) {
  let iv

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
  iv = Buffer.alloc(16, 1)

  const cipher = crypto.createCipheriv(algorithm, encryption_key, iv)

  let encrypted_text = cipher.update('text_to_be_encrypted', 'utf8', 'hex')
  encrypted_text += cipher.final('hex')
  console.log('encrypted text:', encrypted_text)
  return encrypted_text
}

async function modifySecret(file_name, line_no) {
  console.log(`filename: ${file_name} | line: ${line_no}`)
  //open the file

  const readStream = fs.createReadStream(file_name)
  //const writeStream = fs.createWriteStream(file_name)
  //readStream.pipe(writeStream)

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
    terminal: false,
  })
  let count = 1
  for await (let line of rl) {
    if (count === line_no) {
      //writeStream.write(line)
      line = line.split(/\/\*[ ]git-safe[ ]\*\//)

      const encrypted_text = getEncryptedText(line[1].trim().slice(1, -1))
      line[1] = JSON.stringify(encrypted_text)
      line = line.join(' /* git-safe */ ')
      console.log(line)
      break
    }
    count++
  }

  // get the text to be encrypted

  // encrypt the text
  // create the cipher

  // save the encrypted text at the appropriate location
}

const modifySecretHandler = (raw_results) => {
  try {
    //filename can also have ":"
    raw_results = raw_results.split(':')
    const line_no = parseInt(raw_results.pop())
    const file_name = raw_results.join(':')
    modifySecret(file_name, line_no)
  } catch (err) {
    console.log(err)
  }
  //modifySecret(filename,
}

process.argv.forEach(function (val, index, array) {
  if (index < 2) {
    return
  }
  if (index == 2) {
    encryption_key = getEncryptionKey(val)
    return
  }
  modifySecretHandler(val)
})
