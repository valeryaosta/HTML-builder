const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');

readStream
  .on('data', (chunk) => {
    process.stdout.write(chunk);
  })
  .on('error', (error) => {
    console.error('Error when reading the file:', error);
  });
