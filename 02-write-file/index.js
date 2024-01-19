const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt:
    '>> Enter text to write to the file (or print "exit" to finish). And then wait a bit... : ',
});

function finishProcess() {
  console.log('Process successfully finished! Please, come again!');
  writeStream.end();
  process.exit();
}

rl.prompt();

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
    rl.prompt();
  }
})
  .on('close', finishProcess)
  .on('SIGINT', finishProcess);
