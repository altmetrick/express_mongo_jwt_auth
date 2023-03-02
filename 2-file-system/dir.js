const fs = require('fs');
const path = require('path');

console.log(fs.existsSync('./2-file-system/newDir'));

if (!fs.existsSync('./2-file-system/newDir')) {
  fs.mkdir('./2-file-system/newDir', (err) => {
    if (err) throw err;
    console.log('directory was created');
  });
}

if (fs.existsSync('./2-file-system/newDir')) {
  fs.rmdir('./2-file-system/newDir', (err) => {
    if (err) throw err;
    console.log('directory was deleted');
  });
}
