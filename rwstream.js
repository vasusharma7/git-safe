const readWriteStream = (file_name,line_no)=>{

  const readStream = fs.createReadStream(file_name)
  const writeStream = fs.createWriteStream(file_name, { flags: 'r+' })
  readStream.pipe(writeStream)

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
    terminal: false,
  })
  let count = 1
  for await (let line of rl) {
    if (count === line_no - 1) {
      //readStream.unpipe(writeStream)
    }
    if (count === line_no) {
      line = line.split(/\/\*[ ]git-safe[ ]\*\//)
      const encrypted_text = getEncryptedText(line[1].trim().slice(1, -1))
      line[1] = JSON.stringify(encrypted_text)
      line = line.join('  ')
      console.log(line)
      readStream.pipe(writeStream)
      writeStream.write(line)
      break
    }
    count++
  }

}
