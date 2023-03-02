const fs = require('fs');
const path = require('path');

//reading from one file and writing to another with streams

// const rs = fs.createReadStream('./2-file-system/files/large.txt', {
//   encoding: 'utf-8',
// });

const rs = fs.createReadStream(path.join(__dirname, 'files', 'large.txt'), {
  encoding: 'utf-8',
});

const ws = fs.createWriteStream('./2-file-system/files/new-large.txt');

//
// rs.on('data', (dataChunk) => {
//   //console.log(dataChunk);
//   ws.write(dataChunk);
//   console.log('writing is completed');
// });

//making the same with pipe
rs.pipe(ws);
