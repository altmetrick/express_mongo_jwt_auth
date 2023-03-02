// const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

//1 reading a file
//- instead hardcoding a path to file like this './2-file-system/files/starter.txt'
// which can lead to problems, cause different systems use \ or /
// use path module

// fs.readFile(
//   path.join(__dirname, '2-file-system', 'files', 'starter.txt'),
//   'utf8',
//   (err, data) => {
//     if (err) throw err;
//     //console.log(data);
//     console.log(data);
//   }
// );

//2 - write to the file - overwrites existing content of the file
// const content = 'This is a content to write inside a file';
// fs.writeFile(
//   path.join(__dirname, '2-file-system', 'files', 'write.txt'),
//   content,
//   (err) => {
//     if (err) throw err;
//     console.log('writing to file is complete');
//   }
// );

//3 - update a file
// const updateContent = ' Some content to update a file ';
// fs.appendFile(
//   path.join(__dirname, '2-file-system', 'files', 'update.txt'),
//   updateContent,
//   (err) => {
//     if (err) throw err;
//     console.log('Updating is complete');
//   }
// );

// Write to a file => Append to a file => Rename a file
// using callbacks - callback hell
// fs.writeFile(
//   path.join(__dirname, '2-file-system', 'files', 'ex-1.txt'),
//   'Hello 1',
//   (err) => {
//     if (err) throw err;
//     console.log('1 wrote to the ex-1.txt');

//     const textToUpdate = 'New text to update a file';
//     fs.appendFile(
//       path.join(__dirname, '2-file-system', 'files', 'ex-1.txt'),
//       textToUpdate,
//       (err) => {
//         console.log('2 the file ex-1.txt was updated ');

//         fs.rename(
//           path.join(__dirname, '2-file-system', 'files', 'ex-1.txt'),
//           path.join(__dirname, '2-file-system', 'files', 'renamed.txt'),
//           (err) => {
//             if (err) throw err;
//             console.log('3 file was renamed');
//           }
//         );
//       }
//     );
//   }
// );

//2 using async await
// using async await we don't need a callback for .readFile, .writeFile...
// (err, data) =>{}, errors we catch in try catch, and data

const fileOption = async () => {
  try {
    //read file
    const data = await fsPromises.readFile(
      path.join(__dirname, '2-file-system', 'files', 'wrAsync.txt'),
      'utf8'
    );
    console.log(data);
    //write file
    const textToWrite = 'Write promises';
    await fsPromises.writeFile(
      path.join(__dirname, '2-file-system', 'files', 'promiseWr.txt'),
      textToWrite
    );
  } catch (error) {
    throw error;
  }
};

fileOption();

//waiting for error and exit app
process.on('uncaughtException', (err) => {
  console.log('there was an error :', err);
  process.exit(1);
});
